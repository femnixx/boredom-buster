import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// All social routes require authentication
router.use(authenticate);

// @desc    Send friend request
// @route   POST /api/social/friends/request
// @access  Private
export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { friendId } = req.body;

    if (userId === friendId) {
      throw createError('Cannot send friend request to yourself', 400);
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    if (existingFriendship) {
      throw createError('Friendship already exists', 400);
    }

    // Create friend request
    const friendship = await prisma.friendship.create({
      data: {
        userId,
        friendId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        friend: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: friendship,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Accept friend request
// @route   POST /api/social/friends/accept/:requestId
// @access  Private
export const acceptFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { requestId } = req.params;

    const friendship = await prisma.friendship.findFirst({
      where: {
        id: requestId,
        friendId: userId,
        status: 'PENDING',
      },
    });

    if (!friendship) {
      throw createError('Friend request not found', 404);
    }

    const updated = await prisma.friendship.update({
      where: { id: requestId },
      data: {
        status: 'ACCEPTED',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        friend: {
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
      data: updated,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get friends list
// @route   GET /api/social/friends
// @access  Private
export const getFriends = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId, status: 'ACCEPTED' },
          { friendId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            stats: {
              select: {
                level: true,
              },
            },
          },
        },
        friend: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            stats: {
              select: {
                level: true,
              },
            },
          },
        },
      },
    });

    // Extract friend data
    const friends = friendships.map((friendship) => {
      const friend = friendship.userId === userId ? friendship.friend : friendship.user;
      return {
        id: friend.id,
        username: friend.username,
        avatarUrl: friend.avatarUrl,
        level: friend.stats?.level || 1,
        friendshipId: friendship.id,
      };
    });

    return res.status(200).json({
      success: true,
      data: friends,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get pending friend requests
// @route   GET /api/social/friends/requests
// @access  Private
export const getFriendRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const requests = await prisma.friendship.findMany({
      where: {
        friendId: userId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            stats: {
              select: {
                level: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Remove friend
// @route   DELETE /api/social/friends/:friendId
// @access  Private
export const removeFriend = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { friendId } = req.params;

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    if (!friendship) {
      throw createError('Friendship not found', 404);
    }

    await prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Friend removed successfully',
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Create guild
// @route   POST /api/social/guilds
// @access  Private
export const createGuild = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, description, isPublic } = req.body;

    // Create guild with owner as first member
    const guild = await prisma.guild.create({
      data: {
        name,
        description,
        isPublic: isPublic ?? true,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: guild,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get guilds
// @route   GET /api/social/guilds
// @access  Private
export const getGuilds = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;

    const guilds = await prisma.guild.findMany({
      where: {
        isPublic: true,
        ...(search && {
          name: {
            contains: search as string,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        members: {
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        memberCount: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: guilds,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Join guild
// @route   POST /api/social/guilds/:guildId/join
// @access  Private
export const joinGuild = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { guildId } = req.params;

    const guild = await prisma.guild.findUnique({
      where: { id: guildId },
    });

    if (!guild) {
      throw createError('Guild not found', 404);
    }

    if (guild.memberCount >= guild.maxMembers) {
      throw createError('Guild is full', 400);
    }

    // Check if already a member
    const existingMember = await prisma.guildMember.findFirst({
      where: {
        guildId,
        userId,
      },
    });

    if (existingMember) {
      throw createError('Already a member of this guild', 400);
    }

    // Add member
    const member = await prisma.guildMember.create({
      data: {
        guildId,
        userId,
        role: 'MEMBER',
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

    // Update member count
    await prisma.guild.update({
      where: { id: guildId },
      data: {
        memberCount: { increment: 1 },
      },
    });

    return res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Leave guild
// @route   POST /api/social/guilds/:guildId/leave
// @access  Private
export const leaveGuild = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { guildId } = req.params;

    const membership = await prisma.guildMember.findFirst({
      where: {
        guildId,
        userId,
      },
    });

    if (!membership) {
      throw createError('Not a member of this guild', 404);
    }

    if (membership.role === 'OWNER') {
      throw createError('Guild owner cannot leave. Transfer ownership or delete guild.', 400);
    }

    await prisma.guildMember.delete({
      where: { id: membership.id },
    });

    // Update member count
    await prisma.guild.update({
      where: { id: guildId },
      data: {
        memberCount: { decrement: 1 },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Left guild successfully',
    });
  } catch (error) {
    throw error;
  }
};

// Routes
router.post('/friends/request', sendFriendRequest);
router.post('/friends/accept/:requestId', acceptFriendRequest);
router.get('/friends', getFriends);
router.get('/friends/requests', getFriendRequests);
router.delete('/friends/:friendId', removeFriend);
router.post('/guilds', createGuild);
router.get('/guilds', getGuilds);
router.post('/guilds/:guildId/join', joinGuild);
router.post('/guilds/:guildId/leave', leaveGuild);

export { router as socialRoutes };