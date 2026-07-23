import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        stats: true,
        character: {
          include: {
            stats: true,
            appearance: true,
          },
        },
        settings: true,
      },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Update user profile
// @route   PATCH /api/users/me
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { username, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(avatarUrl && { avatarUrl }),
      },
      include: {
        stats: true,
        character: true,
      },
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get user inventory
// @route   GET /api/users/me/inventory
// @access  Private
export const getInventory = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        character: {
          include: {
            inventory: {
              include: {
                item: true,
              },
            },
            equippedItems: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.character) {
      throw createError('Character not found', 404);
    }

    return res.status(200).json({
      success: true,
      data: {
        inventory: user.character.inventory,
        equipped: user.character.equippedItems,
      },
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Equip item
// @route   POST /api/users/me/inventory/equip/:itemId
// @access  Private
export const equipItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;

    // Get user's character
    const character = await prisma.character.findUnique({
      where: { userId },
    });

    if (!character) {
      throw createError('Character not found', 404);
    }

    // Check if item exists in inventory
    const inventoryItem = await prisma.inventory.findFirst({
      where: {
        characterId: character.id,
        itemId,
      },
      include: {
        item: true,
      },
    });

    if (!inventoryItem) {
      throw createError('Item not found in inventory', 404);
    }

    const item = inventoryItem.item;

    // Check if item has a slot
    if (!item.slot) {
      throw createError('This item cannot be equipped', 400);
    }

    // Check if already equipped
    const existingEquipped = await prisma.equippedItem.findFirst({
      where: {
        characterId: character.id,
        slot: item.slot,
      },
    });

    // Unequip existing item in same slot
    if (existingEquipped) {
      await prisma.equippedItem.delete({
        where: { id: existingEquipped.id },
      });
    }

    // Equip new item
    const equipped = await prisma.equippedItem.create({
      data: {
        characterId: character.id,
        itemId,
        slot: item.slot,
      },
      include: {
        item: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: equipped,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Unequip item
// @route   POST /api/users/me/inventory/unequip/:slot
// @access  Private
export const unequipItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { slot } = req.params;

    // Get user's character
    const character = await prisma.character.findUnique({
      where: { userId },
    });

    if (!character) {
      throw createError('Character not found', 404);
    }

    // Find equipped item in slot
    const equippedItem = await prisma.equippedItem.findFirst({
      where: {
        characterId: character.id,
        slot: slot as any,
      },
    });

    if (!equippedItem) {
      throw createError('No item equipped in this slot', 404);
    }

    // Unequip item
    await prisma.equippedItem.delete({
      where: { id: equippedItem.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Item unequipped successfully',
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const { type = 'LEVEL', period = 'ALL_TIME', limit = 100 } = req.query;

    // Get top users by level
    const leaderboard = await prisma.userStats.findMany({
      take: parseInt(limit as string),
      orderBy: {
        [type === 'LEVEL' ? 'level' : type === 'XP' ? 'totalXp' : 'gold']: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    throw error;
  }
};

// Routes
router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.get('/me/inventory', getInventory);
router.post('/me/inventory/equip/:itemId', equipItem);
router.post('/me/inventory/unequip/:slot', unequipItem);
router.get('/leaderboard', getLeaderboard);

export { router as userRoutes };