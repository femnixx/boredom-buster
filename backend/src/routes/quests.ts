import { Router } from 'express';
import {
  getAvailableQuests,
  getActiveQuests,
  acceptQuest,
  abandonQuest,
  getQuestDetails,
  getQuestHistory,
} from '../controllers/questController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All quest routes require authentication
router.use(authenticate);

// GET /api/quests/available - Get available quests
router.get('/available', getAvailableQuests);

// GET /api/quests/active - Get user's active quests
router.get('/active', getActiveQuests);

// POST /api/quests/accept - Accept a quest
router.post('/accept', acceptQuest);

// POST /api/quests/abandon - Abandon a quest
router.post('/abandon', abandonQuest);

// GET /api/quests/:id - Get quest details
router.get('/:id', getQuestDetails);

// GET /api/quests/history - Get quest history
router.get('/history', getQuestHistory);

export { router as questRoutes };