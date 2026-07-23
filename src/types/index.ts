// ============================================
// Core Types
// ============================================

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  emailVerified: boolean;
  oauthProvider?: string;
  createdAt: string;
  updatedAt: string;
  stats?: UserStats;
  settings?: UserSettings;
  character?: Character;
}

export interface UserStats {
  id: string;
  userId: string;
  level: number;
  xp: number;
  totalXp: number;
  gold: number;
  gems: number;
  streakDays: number;
  lastActive: string;
  questsCompleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'dark' | 'light';
  notifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacyProfile: boolean;
  privacyActivity: boolean;
  language: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Character System
// ============================================

export type CharacterClass = 'WARRIOR' | 'MAGE' | 'ROGUE' | 'HEALER' | 'SAGE';

export interface Character {
  id: string;
  userId: string;
  name: string;
  classType: CharacterClass;
  level: number;
  xp: number;
  title?: string;
  createdAt: string;
  updatedAt: string;
  stats?: CharacterStats;
  appearance?: CharacterAppearance;
  inventory?: Inventory[];
  equippedItems?: EquippedItem[];
}

export interface CharacterStats {
  id: string;
  characterId: string;
  strength: number;
  intelligence: number;
  charisma: number;
  stamina: number;
  wisdom: number;
  luck: number;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterAppearance {
  id: string;
  characterId: string;
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfit?: string;
  accessories?: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemType = 'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'CONSUMABLE' | 'MATERIAL' | 'QUEST' | 'COSMETIC';
export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
export type EquipmentSlot = 'HEAD' | 'CHEST' | 'LEGS' | 'FEET' | 'HANDS' | 'MAIN_HAND' | 'OFF_HAND' | 'RING' | 'NECKLACE' | 'BELT' | 'BACK';

export interface Item {
  id: string;
  name: string;
  description?: string;
  type: ItemType;
  rarity: ItemRarity;
  slot?: EquipmentSlot;
  stats?: Record<string, number>;
  iconUrl?: string;
  imageUrl?: string;
  requirements?: Record<string, any>;
  createdAt: string;
}

export interface Inventory {
  id: string;
  characterId: string;
  itemId: string;
  quantity: number;
  createdAt: string;
  item?: Item;
}

export interface EquippedItem {
  id: string;
  characterId: string;
  itemId: string;
  slot: EquipmentSlot;
  createdAt: string;
  updatedAt: string;
  item?: Item;
}

// ============================================
// Quest System
// ============================================

export type QuestDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC' | 'LEGENDARY';
export type QuestType = 'DAILY' | 'WEEKLY' | 'MAIN_STORY' | 'SIDE' | 'HABIT' | 'EVENT' | 'ACHIEVEMENT';
export type QuestStatus = 'ACTIVE' | 'COMPLETED' | 'ABANDONED' | 'EXPIRED' | 'FAILED';

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  type: QuestType;
  xpReward: number;
  goldReward: number;
  gemReward: number;
  requirements?: Record<string, any>;
  prerequisites: string[];
  isRepeatable: boolean;
  cooldownHours?: number;
  maxCompletions?: number;
  isActive: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  steps?: QuestStep[];
  userProgress?: UserQuest;
}

export interface QuestStep {
  id: string;
  questId: string;
  stepNumber: number;
  description: string;
  verificationType: VerificationType;
  targetValue: number;
  instructions?: string;
  hints: string[];
  createdAt: string;
}

export interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  status: QuestStatus;
  progress: number;
  startedAt: string;
  completedAt?: string;
  expiresAt?: string;
  quest?: Quest;
  steps?: UserQuestProgress[];
}

export interface UserQuestProgress {
  id: string;
  userId: string;
  questId: string;
  stepId: string;
  currentValue: number;
  isVerified: boolean;
  verifiedAt?: string;
  verificationId?: string;
  createdAt: string;
  updatedAt: string;
  step?: QuestStep;
}

// ============================================
// Verification System
// ============================================

export type VerificationType = 'PHOTO' | 'VIDEO' | 'TEXT' | 'LOCATION' | 'MULTI_MODAL';
export type VerificationStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';

export interface Verification {
  id: string;
  userId: string;
  questStepId: string;
  type: VerificationType;
  status: VerificationStatus;
  mediaUrl?: string;
  thumbnailUrl?: string;
  aiConfidence?: number;
  aiAnalysis?: Record<string, any>;
  humanVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  photos?: VerificationPhoto[];
  videos?: VerificationVideo[];
  texts?: VerificationText[];
}

export interface VerificationPhoto {
  id: string;
  verificationId: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  exifData?: Record<string, any>;
  analyzedData?: Record<string, any>;
  createdAt: string;
}

export interface VerificationVideo {
  id: string;
  verificationId: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  fileSize?: number;
  frameCount?: number;
  analyzedData?: Record<string, any>;
  createdAt: string;
}

export interface VerificationText {
  id: string;
  verificationId: string;
  content: string;
  wordCount?: number;
  analyzedData?: Record<string, any>;
  createdAt: string;
}

// ============================================
// Social Features
// ============================================

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED' | 'DECLINED';
export type GuildRole = 'OWNER' | 'OFFICER' | 'MEMBER';

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
  user?: User;
  friend?: User;
}

export interface Guild {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  ownerId: string;
  memberCount: number;
  maxMembers: number;
  isPublic: boolean;
  level: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
  members?: GuildMember[];
}

export interface GuildMember {
  id: string;
  guildId: string;
  userId: string;
  role: GuildRole;
  joinedAt: string;
  updatedAt: string;
  user?: User;
}

// ============================================
// Achievements
// ============================================

export type AchievementRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type AchievementCategory = 'QUESTS' | 'SOCIAL' | 'EXPLORATION' | 'COLLECTION' | 'SPECIAL' | 'SEASONAL';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  criteria: Record<string, any>;
  rewards?: Record<string, any>;
  isHidden: boolean;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  unlockedAt?: string;
  createdAt: string;
  achievement?: Achievement;
}

// ============================================
// Economy
// ============================================

export type TransactionType = 'EARNED' | 'SPENT' | 'PURCHASED' | 'SOLD' | 'REWARD' | 'BONUS' | 'REFUND' | 'ADMIN_ADJUSTMENT';
export type CurrencyType = 'GOLD' | 'GEMS';
export type ListingStatus = 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'CANCELLED';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyType;
  description: string;
  relatedId?: string;
  relatedType?: string;
  balance: number;
  createdAt: string;
}

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  itemId: string;
  price: number;
  currency: CurrencyType;
  status: ListingStatus;
  listedAt: string;
  soldAt?: string;
  updatedAt: string;
  item?: Item;
  seller?: User;
}

export interface Purchase {
  id: string;
  buyerId: string;
  listingId: string;
  price: number;
  currency: CurrencyType;
  purchasedAt: string;
}

// ============================================
// Leaderboards
// ============================================

export type LeaderboardType = 'LEVEL' | 'XP' | 'GOLD' | 'QUESTS_COMPLETED' | 'STREAK' | 'GUILD';
export type LeaderboardPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';

export interface Leaderboard {
  id: string;
  userId: string;
  type: LeaderboardType;
  period: LeaderboardPeriod;
  score: number;
  rank?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// ============================================
// Analytics
// ============================================

export type ActivityType = 
  | 'QUEST_STARTED'
  | 'QUEST_COMPLETED'
  | 'QUEST_FAILED'
  | 'ITEM_EQUIPPED'
  | 'ITEM_PURCHASED'
  | 'SOCIAL_INTERACTION'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'LEVEL_UP'
  | 'LOGIN'
  | 'LOGOUT'
  | 'VERIFICATION_SUBMITTED';

export interface UserActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  duration?: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface DailyStat {
  id: string;
  userId: string;
  date: string;
  questsCompleted: number;
  xpEarned: number;
  goldEarned: number;
  playTime: number;
  verifications: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Notifications
// ============================================

export type NotificationType = 
  | 'QUEST_AVAILABLE'
  | 'QUEST_COMPLETED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'FRIEND_REQUEST'
  | 'GUILD_INVITE'
  | 'LEVEL_UP'
  | 'REWARD_RECEIVED'
  | 'SYSTEM'
  | 'PROMOTION';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Array<{ field: string; message: string }>;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface LoginResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
}

export interface RegisterResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
}

// ============================================
// Form Types
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CreateQuestFormData {
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  type: QuestType;
  xpReward: number;
  goldReward: number;
  steps: QuestStepFormData[];
}

export interface QuestStepFormData {
  description: string;
  verificationType: VerificationType;
  targetValue: number;
  instructions?: string;
}

// ============================================
// Game Mechanics
// ============================================

export interface LevelInfo {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  progress: number; // percentage
}

export interface QuestRewards {
  xp: number;
  gold: number;
  gems: number;
  items?: Item[];
}

export interface CharacterClassInfo {
  type: CharacterClass;
  name: string;
  description: string;
  bonusStat: keyof CharacterStats;
  icon: string;
}