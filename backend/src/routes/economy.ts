import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// All economy routes require authentication
router.use(authenticate);

// @desc    Get marketplace listings
// @route   GET /api/economy/marketplace
// @access  Private
export const getMarketplace = async (req: AuthRequest, res: Response) => {
  try {
    const { category, rarity, minPrice, maxPrice, limit = 20, offset = 0 } = req.query;

    const where: any = { status: 'ACTIVE' };

    if (category) {
      where.item = {
        type: category,
      };
    }

    if (rarity) {
      where.item = {
        ...where.item,
        rarity,
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice as string);
      if (maxPrice) where.price.lte = parseInt(maxPrice as string);
    }

    const listings = await prisma.marketplaceListing.findMany({
      where,
      include: {
        item: true,
        seller: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        listedAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.marketplaceListing.count({ where });

    return res.status(200).json({
      success: true,
      data: listings,
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

// @desc    List item for sale
// @route   POST /api/economy/marketplace/list
// @access  Private
export const listItemForSale = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { itemId, price, currency = 'GOLD' } = req.body;

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
    });

    if (!inventoryItem) {
      throw createError('Item not found in inventory', 404);
    }

    // Check if item is already listed
    const existingListing = await prisma.marketplaceListing.findFirst({
      where: {
        sellerId: userId,
        itemId,
        status: 'ACTIVE',
      },
    });

    if (existingListing) {
      throw createError('Item is already listed for sale', 400);
    }

    // Create listing
    const listing = await prisma.marketplaceListing.create({
      data: {
        sellerId: userId,
        itemId,
        price: parseInt(price),
        currency: currency as any,
        status: 'ACTIVE',
      },
      include: {
        item: true,
        seller: {
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
      data: listing,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Purchase item from marketplace
// @route   POST /api/economy/marketplace/purchase/:listingId
// @access  Private
export const purchaseItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { listingId } = req.params;

    // Get listing
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: listingId },
      include: {
        item: true,
        seller: true,
      },
    });

    if (!listing) {
      throw createError('Listing not found', 404);
    }

    if (listing.status !== 'ACTIVE') {
      throw createError('This listing is no longer available', 400);
    }

    if (listing.sellerId === userId) {
      throw createError('Cannot purchase your own item', 400);
    }

    // Get buyer's stats
    const buyerStats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!buyerStats) {
      throw createError('User stats not found', 404);
    }

    // Check if buyer has enough currency
    const buyerCurrency = listing.currency === 'GOLD' ? buyerStats.gold : buyerStats.gems;
    if (buyerCurrency < listing.price) {
      throw createError('Insufficient funds', 400);
    }

    // Get seller's stats
    const sellerStats = await prisma.userStats.findUnique({
      where: { userId: listing.sellerId },
    });

    if (!sellerStats) {
      throw createError('Seller stats not found', 404);
    }

    // Get buyer's character
    const buyerCharacter = await prisma.character.findUnique({
      where: { userId },
    });

    if (!buyerCharacter) {
      throw createError('Character not found', 404);
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from buyer
      await tx.userStats.update({
        where: { userId },
        data: {
          [listing.currency === 'GOLD' ? 'gold' : 'gems']: {
            decrement: listing.price,
          },
        },
      });

      // Add to seller (95% of price, 5% marketplace fee)
      const sellerAmount = Math.floor(listing.price * 0.95);
      await tx.userStats.update({
        where: { userId: listing.sellerId },
        data: {
          [listing.currency === 'GOLD' ? 'gold' : 'gems']: {
            increment: sellerAmount,
          },
        },
      });

      // Add item to buyer's inventory
      await tx.inventory.create({
        data: {
          characterId: buyerCharacter.id,
          itemId: listing.itemId,
          quantity: 1,
        },
      });

      // Remove item from seller's inventory
      const sellerCharacter = await tx.character.findUnique({
        where: { userId: listing.sellerId },
      });

      if (sellerCharacter) {
        await tx.inventory.deleteMany({
          where: {
            characterId: sellerCharacter.id,
            itemId: listing.itemId,
          },
        });
      }

      // Update listing status
      const updatedListing = await tx.marketplaceListing.update({
        where: { id: listingId },
        data: {
          status: 'SOLD',
          soldAt: new Date(),
        },
        include: {
          item: true,
        },
      });

      // Create purchase record
      await tx.purchase.create({
        data: {
          buyerId: userId,
          listingId,
          price: listing.price,
          currency: listing.currency,
        },
      });

      // Create transaction records
      await tx.transaction.createMany({
        data: [
          {
            userId,
            type: 'PURCHASED',
            amount: listing.price,
            currency: listing.currency,
            description: `Purchased ${listing.item.name}`,
            relatedId: listingId,
            relatedType: 'marketplace',
            balance: buyerCurrency - listing.price,
          },
          {
            userId: listing.sellerId,
            type: 'SOLD',
            amount: sellerAmount,
            currency: listing.currency,
            description: `Sold ${listing.item.name}`,
            relatedId: listingId,
            relatedType: 'marketplace',
            balance: (listing.currency === 'GOLD' ? sellerStats.gold : sellerStats.gems) + sellerAmount,
          },
        ],
      });

      return updatedListing;
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Cancel marketplace listing
// @route   DELETE /api/economy/marketplace/:listingId
// @access  Private
export const cancelListing = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { listingId } = req.params;

    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw createError('Listing not found', 404);
    }

    if (listing.sellerId !== userId) {
      throw createError('Not authorized to cancel this listing', 403);
    }

    if (listing.status !== 'ACTIVE') {
      throw createError('Listing is not active', 400);
    }

    await prisma.marketplaceListing.update({
      where: { id: listingId },
      data: {
        status: 'CANCELLED',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Listing cancelled successfully',
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get transaction history
// @route   GET /api/economy/transactions
// @access  Private
export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { limit = 50, offset = 0, type, currency } = req.query;

    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    if (currency) {
      where.currency = currency;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.transaction.count({ where });

    return res.status(200).json({
      success: true,
      data: transactions,
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

// Routes
router.get('/marketplace', getMarketplace);
router.post('/marketplace/list', listItemForSale);
router.post('/marketplace/purchase/:listingId', purchaseItem);
router.delete('/marketplace/:listingId', cancelListing);
router.get('/transactions', getTransactionHistory);

export { router as economyRoutes };