import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';
import { createError } from '../middleware/errorHandler';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// All verification routes require authentication
router.use(authenticate);

// Validation schemas
const photoVerificationSchema = z.object({
  questStepId: z.string(),
  photoUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
});

const textVerificationSchema = z.object({
  questStepId: z.string(),
  content: z.string().min(1, 'Content is required'),
});

// @desc    Submit photo verification
// @route   POST /api/verifications/photo
// @access  Private
export const submitPhotoVerification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { questStepId, photoUrl, thumbnailUrl } = photoVerificationSchema.parse(req.body);

    // Verify quest step exists
    const questStep = await prisma.questStep.findUnique({
      where: { id: questStepId },
      include: { quest: true },
    });

    if (!questStep) {
      throw createError('Quest step not found', 404);
    }

    // Create verification record
    const verification = await prisma.verification.create({
      data: {
        userId,
        questStepId,
        type: 'PHOTO',
        status: 'PROCESSING',
        mediaUrl: photoUrl,
        thumbnailUrl,
      },
      include: {
        photos: {
          create: {
            url: photoUrl,
            thumbnailUrl,
          },
        },
      },
    });

    // TODO: Trigger AI verification process (queue job)
    // For now, we'll simulate AI verification
    setTimeout(async () => {
      // Simulate AI analysis
      const aiConfidence = 0.85 + Math.random() * 0.15; // 85-100%
      
      await prisma.verification.update({
        where: { id: verification.id },
        data: {
          status: aiConfidence > 0.9 ? 'APPROVED' : 'NEEDS_REVIEW',
          aiConfidence,
          aiAnalysis: {
            objects: ['person', 'exercise_equipment'],
            scene: 'indoor',
            quality: 'good',
            confidence: aiConfidence,
          },
        },
      });

      // If approved, update quest progress
      if (aiConfidence > 0.9) {
        await updateQuestProgress(userId, questStep.questId, questStepId);
      }
    }, 2000);

    return res.status(201).json({
      success: true,
      data: verification,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError(error.errors[0].message, 400);
    }
    throw error;
  }
};

// @desc    Submit text verification
// @route   POST /api/verifications/text
// @access  Private
export const submitTextVerification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { questStepId, content } = textVerificationSchema.parse(req.body);

    // Verify quest step exists
    const questStep = await prisma.questStep.findUnique({
      where: { id: questStepId },
      include: { quest: true },
    });

    if (!questStep) {
      throw createError('Quest step not found', 404);
    }

    // Create verification record
    const verification = await prisma.verification.create({
      data: {
        userId,
        questStepId,
        type: 'TEXT',
        status: 'PROCESSING',
      },
      include: {
        texts: {
          create: {
            content,
            wordCount: content.split(/\s+/).length,
          },
        },
      },
    });

    // TODO: Trigger AI text analysis
    setTimeout(async () => {
      const wordCount = content.split(/\s+/).length;
      const aiConfidence = wordCount >= 50 ? 0.9 : 0.6;
      
      await prisma.verification.update({
        where: { id: verification.id },
        data: {
          status: aiConfidence > 0.8 ? 'APPROVED' : 'NEEDS_REVIEW',
          aiConfidence,
          aiAnalysis: {
            wordCount,
            sentiment: 'positive',
            relevance: 0.85,
            grammar: 0.9,
          },
        },
      });

      if (aiConfidence > 0.8) {
        await updateQuestProgress(userId, questStep.questId, questStepId);
      }
    }, 1500);

    return res.status(201).json({
      success: true,
      data: verification,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError(error.errors[0].message, 400);
    }
    throw error;
  }
};

// @desc    Get verification status
// @route   GET /api/verifications/:id/status
// @access  Private
export const getVerificationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const verification = await prisma.verification.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        photos: true,
        videos: true,
        texts: true,
      },
    });

    if (!verification) {
      throw createError('Verification not found', 404);
    }

    return res.status(200).json({
      success: true,
      data: verification,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get user's verifications
// @route   GET /api/verifications
// @access  Private
export const getMyVerifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { limit = 20, offset = 0, status } = req.query;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const verifications = await prisma.verification.findMany({
      where,
      include: {
        photos: true,
        videos: true,
        texts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.verification.count({ where });

    return res.status(200).json({
      success: true,
      data: verifications,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    throw error;
  }
};

// Helper function to update quest progress
async function updateQuestProgress(userId: string, questId: string, stepId: string) {
  try {
    // Get the quest step
    const step = await prisma.questStep.findUnique({
      where: { id: stepId },
    });

    if (!step) return;

    // Update user quest progress
    await prisma.userQuestProgress.updateMany({
      where: {
        userId,
        questId,
        stepId,
      },
      data: {
        currentValue: step.targetValue,
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    // Check if all steps are completed
    const userQuest = await prisma.userQuest.findUnique({
      where: {
        userId_questId: {
          userId,
          questId,
        },
      },
      include: {
        steps: {
          where: {
            isVerified: true,
          },
        },
        quest: {
          include: {
            steps: true,
          },
        },
      },
    });

    if (!userQuest) return;

    const totalSteps = userQuest.quest.steps.length;
    const completedSteps = userQuest.steps.length;

    if (completedSteps === totalSteps) {
      // Quest completed! Award rewards
      await completeQuest(userId, questId, userQuest);
    }
  } catch (error) {
    console.error('Error updating quest progress:', error);
  }
}

// Helper function to complete quest and award rewards
async function completeQuest(userId: string, questId: string, userQuest: any) {
  try {
    const quest = userQuest.quest;

    // Update user quest status
    await prisma.userQuest.update({
      where: { id: userQuest.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Get user stats
    const userStats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!userStats) return;

    // Calculate rewards with streak bonus
    const streakMultiplier = 1 + (userStats.streakDays * 0.1); // 10% bonus per streak day
    const xpReward = Math.floor(quest.xpReward * streakMultiplier);
    const goldReward = Math.floor(quest.goldReward * streakMultiplier);

    // Update user stats
    const newTotalXp = userStats.totalXp + xpReward;
    const newXp = userStats.xp + xpReward;
    const newGold = userStats.gold + goldReward;

    // Calculate new level
    const newLevel = calculateLevel(newTotalXp);

    await prisma.userStats.update({
      where: { userId },
      data: {
        xp: newXp,
        totalXp: newTotalXp,
        gold: newGold,
        level: newLevel,
        questsCompleted: { increment: 1 },
        lastActive: new Date(),
      },
    });

    // Create transaction records
    await prisma.transaction.createMany({
      data: [
        {
          userId,
          type: 'REWARD',
          amount: xpReward,
          currency: 'GOLD',
          description: `Quest completed: ${quest.title}`,
          relatedId: questId,
          relatedType: 'quest',
          balance: newGold,
        },
        {
          userId,
          type: 'EARNED',
          amount: goldReward,
          currency: 'GOLD',
          description: `Quest reward: ${quest.title}`,
          relatedId: questId,
          relatedType: 'quest',
          balance: newGold,
        },
      ],
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId,
        activityType: 'QUEST_COMPLETED',
        metadata: {
          questId,
          questTitle: quest.title,
          xpEarned: xpReward,
          goldEarned: goldReward,
        },
      },
    });

    // Check for level up
    if (newLevel > userStats.level) {
      await prisma.userActivity.create({
        data: {
          userId,
          activityType: 'LEVEL_UP',
          metadata: {
            newLevel,
            previousLevel: userStats.level,
          },
        },
      });
    }

    // TODO: Check for achievements
    // TODO: Send notification to user
  } catch (error) {
    console.error('Error completing quest:', error);
  }
}

// Helper function to calculate level from total XP
function calculateLevel(totalXp: number): number {
  // Simple level calculation: level = sqrt(totalXp / 100)
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

// Routes
router.post('/photo', submitPhotoVerification);
router.post('/text', submitTextVerification);
router.get('/:id/status', getVerificationStatus);
router.get('/', getMyVerifications);

export { router as verificationRoutes };