# Boredom Buster - Product Specification & Architectural Blueprint

## Executive Summary

**Boredom Buster** is a gamified RPG web application designed to cure boredom, break digital micro-addictions, and incentivize real-world action through multimodal AI verification. The application transforms everyday tasks into an engaging role-playing game experience, rewarding users for completing real-world activities.

---

## 1. Product Vision & Core Features

### 1.1 Vision
Create an engaging platform that transforms mundane tasks into epic quests, using AI verification to ensure authenticity and gamification to maintain user motivation.

### 1.2 Core Features

#### 🎮 RPG Character System
- **Character Creation**: Customizable avatars with classes (Warrior, Mage, Rogue, Healer)
- **Level Progression**: XP-based leveling system with skill trees
- **Stats System**: Strength, Intelligence, Charisma, Stamina, Wisdom
- **Equipment & Inventory**: Weapons, armor, accessories with rarity tiers
- **Skill Trees**: Unlock abilities based on playstyle and completed quests

#### 📋 Quest System
- **Daily Quests**: Rotating tasks with varying difficulty
- **Main Story Quests**: Narrative-driven multi-step missions
- **Side Quests**: Optional challenges for bonus rewards
- **Habit Quests**: Recurring tasks for consistent engagement
- **One-time Quests**: Special events and achievements

#### 🤖 AI Verification Engine
- **Photo Verification**: Computer vision for task completion
- **Video Analysis**: Action recognition for complex tasks
- **Text Analysis**: NLP for reading/writing tasks
- **Location Verification**: GPS-based outdoor activities
- **Multi-modal Fusion**: Combine multiple verification methods

#### 🏆 Gamification Elements
- **Achievements System**: 100+ unlockable achievements
- **Leaderboards**: Global, regional, and friend-based rankings
- **Guilds/Parties**: Team-based challenges and social features
- **Season Pass**: Monthly themed content with exclusive rewards
- **Daily Streaks**: Bonus multipliers for consecutive days

#### 💰 Economy System
- **Gold Currency**: Earned from quests, used for purchases
- **Gems**: Premium currency (optional microtransactions)
- **Marketplace**: Player-to-player trading system
- **Loot Boxes**: Randomized rewards with rarity guarantees

#### 📊 Analytics & Insights
- **Progress Tracking**: Visual charts and statistics
- **Habit Analysis**: AI-powered insights on user behavior
- **Productivity Metrics**: Real-world impact measurement
- **Social Comparison**: Anonymous benchmarking against peers

---

## 2. Technical Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React SPA  │  │  Mobile App  │  │  PWA Support │     │
│  │  (TypeScript)│  │  (React Nat) │  │   (Offline)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Express.js │  │   GraphQL    │  │   REST API   │     │
│  │   Gateway    │  │   Endpoints  │  │   v2         │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Auth Service │   │ Game Service │   │  AI Service  │
│  (JWT/OAuth) │   │  (Core RPG)  │   │ (Verification│
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │    Redis     │  │   S3/Blob    │     │
│  │  (Primary)   │  │   (Cache)    │  │  (Media)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  OpenAI API  │  │   Cloudinary │  │   SendGrid   │     │
│  │  (GPT-4/Vision│  │   (Images)   │  │   (Email)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

#### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand + React Query
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library

#### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js / Fastify
- **Language**: TypeScript
- **ORM**: Prisma
- **Authentication**: JWT + OAuth 2.0
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary
- **Queue**: BullMQ (for AI processing)
- **Testing**: Jest + Supertest

#### Database
- **Primary**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Search**: Elasticsearch (optional, for quest search)
- **Migrations**: Prisma Migrate

#### AI/ML Services
- **Image Recognition**: OpenAI GPT-4 Vision / Google Vision API
- **Text Analysis**: OpenAI GPT-4 / Claude API
- **Video Analysis**: Custom TensorFlow.js models
- **Recommendations**: Collaborative filtering + content-based

#### DevOps
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Prometheus + Grafana
- **Logging**: Winston + ELK Stack
- **Hosting**: AWS / Vercel (frontend) + Railway/Render (backend)

---

## 3. Database Schema Design

### 3.1 Core Entities

```sql
-- Users & Authentication
users (id, email, username, password_hash, avatar_url, created_at, updated_at)
user_stats (user_id, level, xp, gold, gems, streak_days, last_active)
user_settings (user_id, theme, notifications, privacy_settings)

-- Character System
characters (id, user_id, name, class_type, level, xp, created_at)
character_stats (character_id, strength, intelligence, charisma, stamina, wisdom)
character_appearance (character_id, skin_color, hair_style, hair_color, eye_color)
inventory (id, character_id, item_id, quantity, equipped)
items (id, name, type, rarity, stats, description, icon_url)

-- Quest System
quests (id, title, description, difficulty, xp_reward, gold_reward, type, requirements)
user_quests (id, user_id, quest_id, status, progress, started_at, completed_at)
quest_steps (id, quest_id, step_number, description, verification_type, target_value)
user_quest_progress (user_id, quest_id, step_id, current_value, verified)

-- Verification System
verifications (id, user_id, quest_step_id, type, status, media_url, ai_confidence, verified_at)
verification_photos (id, verification_id, url, analyzed_data)
verification_videos (id, verification_id, url, duration, analyzed_data)

-- Social Features
guilds (id, name, description, owner_id, created_at)
guild_members (guild_id, user_id, role, joined_at)
friendships (user_id, friend_id, status, created_at)
leaderboards (id, type, period, user_id, score, rank)

-- Achievements
achievements (id, name, description, icon_url, rarity, criteria)
user_achievements (user_id, achievement_id, unlocked_at, progress)

-- Economy
transactions (id, user_id, type, amount, currency, description, related_id)
marketplace_listings (id, seller_id, item_id, price, currency, listed_at)
purchases (id, buyer_id, listing_id, price, purchased_at)

-- Analytics
user_activity (user_id, activity_type, duration, metadata, timestamp)
daily_stats (user_id, date, quests_completed, xp_earned, gold_earned, play_time)
```

### 3.2 Indexes & Performance

```sql
-- Performance indexes
CREATE INDEX idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX idx_verifications_user_id ON verifications(user_id, status);
CREATE INDEX idx_leaderboards_type_period ON leaderboards(type, period, score DESC);
CREATE INDEX idx_user_activity_timestamp ON user_activity(timestamp);
```

---

## 4. API Design

### 4.1 REST API Endpoints

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/oauth/:provider
```

#### User & Character
```
GET    /api/users/me
PATCH  /api/users/me
GET    /api/users/me/character
PATCH  /api/users/me/character
GET    /api/users/me/inventory
POST   /api/users/me/inventory/equip/:item_id
POST   /api/users/me/inventory/unequip/:slot
```

#### Quests
```
GET    /api/quests/daily
GET    /api/quests/available
GET    /api/quests/:id
POST   /api/quests/:id/accept
POST   /api/quests/:id/abandon
POST   /api/quests/:id/complete
GET    /api/quests/history
```

#### Verification
```
POST   /api/verifications/photo
POST   /api/verifications/video
POST   /api/verifications/text
GET    /api/verifications/:id/status
```

#### Social
```
GET    /api/users/leaderboard
POST   /api/friends/request
POST   /api/friends/accept/:request_id
DELETE /api/friends/:friend_id
GET    /api/guilds
POST   /api/guilds
POST   /api/guilds/:id/join
GET    /api/guilds/:id/members
```

#### Economy
```
GET    /api/marketplace
POST   /api/marketplace/list
POST   /api/marketplace/purchase/:listing_id
GET    /api/transactions/history
```

### 4.2 WebSocket Events

```typescript
// Real-time features
interface WebSocketEvents {
  // Notifications
  'notification:new': Notification;
  'achievement:unlocked': Achievement;
  
  // Social
  'friend:request': FriendRequest;
  'guild:invite': GuildInvite;
  'leaderboard:update': LeaderboardUpdate;
  
  // Quest
  'quest:completed': QuestCompletion;
  'quest:new_available': Quest;
  
  // Economy
  'marketplace:item_sold': SaleNotification;
  'transaction:completed': Transaction;
}
```

---

## 5. AI Verification System

### 5.1 Verification Types

#### Photo Verification
```typescript
interface PhotoVerification {
  taskType: 'reading' | 'exercise' | 'outdoor' | 'creative' | 'chores';
  analysis: {
    objects: string[];
    confidence: number;
    scene: string;
    quality: number;
    textDetected?: string;
  };
  validation: {
    isValid: boolean;
    reason?: string;
    suggestions?: string[];
  };
}
```

#### Video Analysis
```typescript
interface VideoVerification {
  taskType: 'workout' | 'dance' | 'instrument' | 'cooking';
  frames: FrameAnalysis[];
  motionAnalysis: {
    intensity: number;
    duration: number;
    consistency: number;
  };
  validation: {
    isValid: boolean;
    confidence: number;
  };
}
```

#### Text Analysis
```typescript
interface TextVerification {
  taskType: 'writing' | 'reflection' | 'learning';
  analysis: {
    wordCount: number;
    sentiment: string;
    relevance: number;
    grammar: number;
  };
  validation: {
    isValid: boolean;
    feedback: string;
  };
}
```

### 5.2 AI Pipeline

```
User Upload → Preprocessing → AI Model → Validation → Reward Distribution
     ↓              ↓            ↓           ↓              ↓
  Media File  → Resize/     → GPT-4    → Rule       → XP/Gold/
               Compress      Vision     Engine      Items
```

---

## 6. Game Mechanics

### 6.1 Level Progression

```typescript
const LEVEL_XP_REQUIREMENTS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  // ... exponential growth
];

const calculateLevel = (totalXP: number): number => {
  return LEVEL_XP_REQUIREMENTS.findIndex(required => totalXP < required);
};
```

### 6.2 Quest Difficulty & Rewards

```typescript
const QUEST_DIFFICULTY = {
  EASY: { xpMultiplier: 1, goldMultiplier: 1, timeEstimate: '5-10 min' },
  MEDIUM: { xpMultiplier: 2, goldMultiplier: 1.5, timeEstimate: '15-30 min' },
  HARD: { xpMultiplier: 4, goldMultiplier: 3, timeEstimate: '1-2 hours' },
  EPIC: { xpMultiplier: 10, goldMultiplier: 10, timeEstimate: '3+ hours' },
};
```

### 6.3 Character Classes

```typescript
enum CharacterClass {
  WARRIOR = 'warrior',    // +Strength, physical tasks
  MAGE = 'mage',          // +Intelligence, learning tasks
  ROGUE = 'rogue',        // +Charisma, social tasks
  HEALER = 'healer',      // +Stamina, health tasks
  SAGE = 'sage',          // +Wisdom, reflection tasks
}
```

---

## 7. Security & Privacy

### 7.1 Authentication & Authorization
- JWT with refresh tokens
- OAuth 2.0 (Google, GitHub, Discord)
- Rate limiting per endpoint
- IP-based throttling
- CSRF protection

### 7.2 Data Protection
- End-to-end encryption for sensitive data
- GDPR compliance
- Data retention policies
- User data export/deletion
- Media file auto-deletion after 30 days

### 7.3 AI Safety
- Content moderation pipeline
- Bias detection in AI models
- Human review for edge cases
- Appeal system for false rejections

---

## 8. Performance & Scalability

### 8.1 Performance Targets
- API Response Time: < 200ms (p95)
- Page Load: < 2s
- AI Verification: < 5s
- Concurrent Users: 10,000+
- Database Queries: < 50ms

### 8.2 Caching Strategy
- Redis for session data
- CDN for static assets
- Database query caching
- AI model result caching

### 8.3 Scalability
- Horizontal scaling with load balancers
- Database read replicas
- Microservices for AI processing
- Queue-based task processing

---

## 9. Development Phases

### Phase 1: MVP (4-6 weeks)
- [x] User authentication
- [ ] Basic character creation
- [ ] Simple quest system (5-10 quests)
- [ ] Photo verification (basic)
- [ ] Core RPG mechanics (XP, levels)
- [ ] Basic UI/UX

### Phase 2: Core Features (4-6 weeks)
- [ ] Advanced character system (stats, inventory)
- [ ] Expanded quest library (50+ quests)
- [ ] AI verification improvements
- [ ] Achievements system
- [ ] Leaderboards
- [ ] Social features (friends)

### Phase 3: Advanced Features (4-6 weeks)
- [ ] Guild system
- [ ] Marketplace
- [ ] Advanced AI (video, text)
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

### Phase 4: Polish & Scale (2-4 weeks)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation
- [ ] Beta testing
- [ ] Launch preparation

---

## 10. Monetization Strategy

### 10.1 Revenue Streams
1. **Freemium Model**: Free core features, premium subscriptions
2. **Cosmetic Items**: Skins, emotes, visual effects
3. **Battle Pass**: Seasonal content ($9.99/month)
4. **Boosters**: XP/Gold multipliers (limited use)
5. **Premium Quests**: Exclusive high-reward quests

### 10.2 Subscription Tiers

#### Free Tier
- 3 quests per day
- Basic character customization
- Standard verification
- Ads (optional)

#### Premium ($4.99/month)
- Unlimited quests
- Advanced character features
- Priority AI verification
- No ads
- Exclusive quests

#### Pro ($9.99/month)
- All Premium features
- Guild creation
- Marketplace access
- Advanced analytics
- Early access to new features

---

## 11. Success Metrics

### 11.1 User Engagement
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average Session Duration: > 15 minutes
- Quest Completion Rate: > 60%
- 7-Day Retention: > 40%
- 30-Day Retention: > 20%

### 11.2 Business Metrics
- Conversion Rate: Free → Premium > 5%
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (LTV)
- Churn Rate: < 5% monthly

### 11.3 Technical Metrics
- Uptime: > 99.5%
- API Success Rate: > 99.9%
- AI Verification Accuracy: > 95%
- User Satisfaction Score: > 4.5/5

---

## 12. Risk Assessment & Mitigation

### 12.1 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| AI verification false positives | High | Human review queue, appeal system |
| Scalability issues | High | Cloud auto-scaling, load testing |
| Data breaches | Critical | Encryption, security audits, compliance |

### 12.2 Business Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low user adoption | High | Beta testing, user feedback loops |
| Competition | Medium | Unique features, strong community |
| Regulatory changes | Medium | Legal compliance team, flexible architecture |

---

## 13. Next Steps

1. **Setup Development Environment**
   - Initialize backend (Express + Prisma)
   - Setup database schema
   - Configure CI/CD pipeline

2. **Implement Core Backend**
   - Authentication system
   - User management
   - Basic quest CRUD

3. **Build Frontend Foundation**
   - Component library
   - State management
   - Routing structure

4. **Integrate AI Services**
   - OpenAI API integration
   - Image processing pipeline
   - Verification logic

5. **Testing & QA**
   - Unit tests
   - Integration tests
   - E2E tests
   - Load testing

---

## Appendix A: File Structure

```
boredom-buster/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── stores/          # State management
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── public/
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utilities
│   │   └── types/           # TypeScript types
│   └── prisma/
│       └── schema.prisma    # Database schema
│
├── ai-service/              # AI/ML microservice
│   ├── src/
│   │   ├── models/          # AI models
│   │   ├── processors/      # Image/video processors
│   │   └── validators/      # Verification logic
│   └── models/              # Trained models
│
├── docs/                    # Documentation
├── scripts/                 # Deployment scripts
└── docker-compose.yml       # Local development
```

---

## Appendix B: API Rate Limits

| Endpoint | Rate Limit | Window |
|----------|-----------|--------|
| Authentication | 5 requests | 1 minute |
| Quest Submission | 10 requests | 1 minute |
| AI Verification | 3 requests | 1 minute |
| General API | 100 requests | 1 minute |

---

## Appendix C: Quest Examples

### Daily Quest: "Morning Energizer"
```yaml
title: "Morning Energizer"
description: "Complete 10 minutes of stretching or exercise"
difficulty: EASY
xp_reward: 50
gold_reward: 25
verification: photo
requirements:
  - type: exercise
  duration: 600 # seconds
steps:
  - description: "Start your exercise routine"
  - description: "Complete 10 minutes of activity"
  - description: "Submit verification photo"
```

### Main Quest: "Knowledge Seeker"
```yaml
title: "Knowledge Seeker - Chapter 1"
description: "Read 3 educational articles and summarize each"
difficulty: MEDIUM
xp_reward: 200
gold_reward: 100
verification: text
requirements:
  - type: reading
  count: 3
steps:
  - description: "Read first article"
  - description: "Write summary (50+ words)"
  - description: "Read second article"
  - description: "Write summary (50+ words)"
  - description: "Read third article"
  - description: "Write summary (50+ words)"
```

---

*Document Version: 1.0*  
*Last Updated: 2026-07-23*  
*Status: Approved for Implementation*