import { Request, Response } from 'express';
import { prisma } from '../index';
import { z } from 'zod';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const acceptQuestSchema = z.object({
  questId: z.string(),
});

// @desc    Get available quests for user
// @route   GET /api/quests/available
// @access  Private
export const getAvailableQuests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get user's character and stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        character: true,
        stats: true,
        activeQuests: {
          where: { status: 'ACTIVE' },
          select: { questId: true },
        },
      },
    });

    if (!user || !user.character) {
      throw createError('Character not found', 404);
    }

    // Get all active quests
    const allQuests = await prisma.quest.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ isPremium: false }, { isPremium: true }] }, // Include all for now
        ],
      },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    // Filter quests based on requirements and completion status
    const availableQuests = allQuests.filter((quest) => {
      // Check if already active
      const isActive = user.activeQuests.some(aq => aq.questId === quest.id);
      if (isActive) return false;

      // Check level requirement
      if (quest.requirements && quest.requirements.level) {
        if (user.stats!.level < quest.requirements.level) return false;
      }

      // Check class requirement
      if (quest.requirements && quest.requirements.class) {
        const allowedClasses = Array.isArray(quest.requirements.class)
          ? quest.requirements.class
          : [quest.requirements.class];
        if (!allowedClasses.includes(user.character!.classType)) return false;
      }

      return true;
    });

    return res.status(200).json({
      success: true,
      data: availableQuests,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get user's active quests
// @route   GET /api/quests/active
// @access  Private
export const getActiveQuests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const activeQuests = await prisma.userQuest.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        quest: {
          include: {
            steps: {
              orderBy: { stepNumber: 'asc' },
            },
          },
        },
        steps: {
          include: {
            step: true,
          },
          orderBy: {
            step: {
              stepNumber: 'asc',
            },
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: activeQuests,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Accept a quest
// @route   POST /api/quests/accept
// @access  Private
export const acceptQuest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { questId } = acceptQuestSchema.parse(req.body);

    // Check if quest exists
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!quest) {
      throw createError('Quest not found', 404);
    }

    // Check if already accepted
    const existingQuest = await prisma.userQuest.findUnique({
      where: {
        userId_questId: {
          userId,
          questId,
        },
      },
    });

    if (existingQuest) {
      throw createError('You have already accepted this quest', 400);
    }

    // Create user quest with progress tracking
    const userQuest = await prisma.userQuest.create({
      data: {
        userId,
        questId,
        status: 'ACTIVE',
        steps: {
          create: quest.steps.map((step) => ({
            stepId: step.id,
            currentValue: 0,
            isVerified: false,
          })),
        },
      },
      include: {
        quest: {
          include: {
            steps: {
              orderBy: { stepNumber: 'asc' },
            },
          },
        },
        steps: {
          include: {
            step: true,
          },
        },
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId,
        activityType: 'QUEST_STARTED',
        metadata: { questId, questTitle: quest.title },
      },
    });

    return res.status(201).json({
      success: true,
      data: userQuest,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError(error.errors[0].message, 400);
    }
    throw error;
  }
};

// @desc    Abandon a quest
// @route   POST /api/quests/abandon
// @access  Private
export const abandonQuest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { questId } = z.object({ questId: z.string() }).parse(req.body);

    const userQuest = await prisma.userQuest.findUnique({
      where: {
        userId_questId: {
          userId,
          questId,
        },
      },
    });

    if (!userQuest) {
      throw createError('Quest not found', 404);
    }

    if (userQuest.status !== 'ACTIVE') {
      throw createError('Cannot abandon a completed quest', 400);
    }

    await prisma.userQuest.update({
      where: { id: userQuest.id },
      data: {
        status: 'ABANDONED',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Quest abandoned successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError(error.errors[0].message, 400);
    }
    throw error;
  }
};

// @desc    Get quest details
// @route   GET /api/quests/:id
// @access  Private
export const getQuestDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const quest = await prisma.quest.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!quest) {
      throw createError('Quest not found', 404);
    }

    // Get user's progress if they have accepted the quest
    const userQuest = await prisma.userQuest.findUnique({
      where: {
        userId_questId: {
          userId,
          questId: id,
        },
      },
      include: {
        steps: {
          include: {
            step: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        ...quest,
        userProgress: userQuest || null,
      },
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get quest history
// @route   GET /api/quests/history
// @access  Private
export const getQuestHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, limit = 20, offset = 0 } = req.query;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const quests = await prisma.userQuest.findMany({
      where,
      include: {
        quest: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.userQuest.count({ where });

    return res.status(200).json({
      success: true,
      data: quests,
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