import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { z } from 'zod';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );

  return { accessToken, refreshToken };
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw createError('User with this email or username already exists', 409);
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user with stats and settings
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        stats: {
          create: {
            level: 1,
            xp: 0,
            totalXp: 0,
            gold: 100, // Starting gold
            gems: 10, // Starting gems
            streakDays: 0,
          },
        },
        settings: {
          create: {
            theme: 'dark',
            notifications: true,
            emailNotifications: true,
            pushNotifications: true,
          },
        },
        character: {
          create: {
            name: username,
            classType: 'WARRIOR',
            title: 'Novice',
            stats: {
              create: {
                strength: 10,
                intelligence: 10,
                charisma: 10,
                stamina: 10,
                wisdom: 10,
                luck: 10,
              },
            },
            appearance: {
              create: {},
            },
          },
        },
      },
      include: {
        stats: true,
        character: true,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (exclude password hash)
    const { passwordHash: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError(error.errors[0].message, 400);
    }
    throw error;
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user with password hash
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        stats: true,
        character: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw createError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    // Update last active
    await prisma.userStats.update({
      where: { userId: user.id },
      data: { lastActive: new Date() },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (exclude password hash)
    const { passwordHash: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        accessToken,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError(error.errors[0].message, 400);
    }
    throw error;
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createError('Refresh token not provided', 401);
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw createError('User not found', 401);
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    return res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    throw createError('Invalid refresh token', 401);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        stats: true,
        settings: true,
        character: {
          include: {
            stats: true,
            appearance: true,
          },
        },
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