# 🎮 Boredom Buster

> A gamified RPG web application that transforms everyday tasks into epic quests, using AI verification to ensure authenticity and gamification to maintain motivation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

## 🌟 Features

### 🎮 RPG Character System
- **5 Character Classes**: Warrior, Mage, Rogue, Healer, Sage
- **6 Core Stats**: Strength, Intelligence, Charisma, Stamina, Wisdom, Luck
- **Level Progression**: XP-based leveling with exponential growth
- **Equipment System**: Weapons, armor, accessories with rarity tiers (Common → Mythic)
- **Skill Trees**: Unlock abilities based on playstyle

### 📋 Quest System
- **Multiple Quest Types**: Daily, Weekly, Main Story, Side, Habit, Event
- **5 Difficulty Levels**: Easy, Medium, Hard, Epic, Legendary
- **Multi-Step Quests**: Complex objectives with progress tracking
- **Streak Bonuses**: 10% additional rewards per consecutive day

### 🤖 AI Verification Engine
- **Photo Verification**: Computer vision for task completion
- **Text Analysis**: NLP for reading/writing tasks
- **Video Analysis**: Action recognition (coming soon)
- **Location Verification**: GPS-based activities (coming soon)
- **Confidence Scoring**: 90%+ for auto-approval

### 🏆 Gamification
- **Achievements**: 100+ unlockable achievements
- **Leaderboards**: Global, regional, and friend-based rankings
- **Guilds/Parties**: Team-based challenges
- **Daily Streaks**: Bonus multipliers for consecutive days
- **Season Pass**: Monthly themed content

### 💰 Economy System
- **Gold Currency**: Earned from quests
- **Gems**: Premium currency
- **Marketplace**: Player-to-player trading
- **Transaction History**: Complete audit trail

### 👥 Social Features
- **Friends System**: Add and manage friends
- **Guilds**: Create or join guilds
- **Social Interaction**: Chat and collaborate
- **Friend Leaderboards**: Compete with friends

### 📊 Analytics & Insights
- **Progress Tracking**: Visual charts and statistics
- **Habit Analysis**: AI-powered insights
- **Productivity Metrics**: Real-world impact measurement
- **Daily Stats**: Track daily progress

## 🏗️ Architecture

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
│  │   Express.js │  │   REST API   │  │   WebSocket  │     │
│  │   Gateway    │  │   v2         │  │   Events     │     │
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
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+ (optional)
- Docker & Docker Compose (recommended)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/femnixx/boredom-buster.git
   cd boredom-buster
   ```

2. **Setup environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec api npm run db:migrate
   ```

5. **Seed the database**
   ```bash
   docker-compose exec api npm run db:seed
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Prisma Studio: http://localhost:5555

### Option 2: Manual Setup

#### Backend Setup

```bash
# Install dependencies
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

#### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
boredom-buster/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # External services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seed data
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── src/                     # React Frontend
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components
│   │   └── auth/           # Auth components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   ├── App.tsx
│   └── main.tsx
│
├── public/                  # Static assets
├── docker-compose.yml       # Docker services
├── Dockerfile.frontend      # Frontend Dockerfile
├── nginx.conf              # Nginx configuration
├── package.json            # Frontend dependencies
├── tsconfig.json           # TypeScript config
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **State Management**: React Context + Hooks
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Logging**: Winston

### Database
- **Primary**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Migrations**: Prisma Migrate

### DevOps
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx
- **Process Manager**: dumb-init

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
POST   /api/auth/refresh       - Refresh access token
GET    /api/auth/me            - Get current user
```

### User Endpoints
```
GET    /api/users/me                      - Get profile
PATCH  /api/users/me                      - Update profile
GET    /api/users/me/inventory            - Get inventory
POST   /api/users/me/inventory/equip/:id  - Equip item
POST   /api/users/me/inventory/unequip/:slot - Unequip item
GET    /api/users/leaderboard             - Get leaderboard
```

### Quest Endpoints
```
GET    /api/quests/available    - Get available quests
GET    /api/quests/active       - Get active quests
POST   /api/quests/accept       - Accept quest
POST   /api/quests/abandon      - Abandon quest
GET    /api/quests/:id          - Get quest details
GET    /api/quests/history      - Get quest history
```

### Verification Endpoints
```
POST   /api/verifications/photo     - Submit photo
POST   /api/verifications/text      - Submit text
GET    /api/verifications/:id/status - Get status
GET    /api/verifications           - Get my verifications
```

### Social Endpoints
```
POST   /api/social/friends/request        - Send friend request
POST   /api/social/friends/accept/:id     - Accept request
GET    /api/social/friends                - Get friends
GET    /api/social/friends/requests       - Get requests
DELETE /api/social/friends/:id            - Remove friend
POST   /api/social/guilds                 - Create guild
GET    /api/social/guilds                 - Get guilds
POST   /api/social/guilds/:id/join        - Join guild
POST   /api/social/guilds/:id/leave       - Leave guild
```

### Economy Endpoints
```
GET    /api/economy/marketplace              - Get listings
POST   /api/economy/marketplace/list         - List item
POST   /api/economy/marketplace/purchase/:id - Purchase
DELETE /api/economy/marketplace/:id          - Cancel listing
GET    /api/economy/transactions             - Get history
```

## 🎮 Game Mechanics

### Level Progression
```typescript
// XP required per level
const LEVEL_XP_REQUIREMENTS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  // ... exponential growth
];

// Level calculation
const calculateLevel = (totalXP: number): number => {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};
```

### Streak Bonus
```typescript
// 10% bonus per consecutive day
const streakMultiplier = 1 + (streakDays * 0.1);
const xpReward = baseXp * streakMultiplier;
const goldReward = baseGold * streakMultiplier;
```

### Character Classes
| Class | Bonus Stat | Playstyle |
|-------|-----------|-----------|
| WARRIOR | Strength | Physical tasks, exercise |
| MAGE | Intelligence | Learning, reading |
| ROGUE | Charisma | Social tasks |
| HEALER | Stamina | Health, wellness |
| SAGE | Wisdom | Reflection, meditation |

## 🔒 Security

- **Helmet.js**: Security headers
- **CORS**: Configured origins
- **Rate Limiting**: 100 req/min (general), 5 req/min (auth)
- **JWT**: Access + refresh tokens
- **bcrypt**: Password hashing (12 rounds)
- **Zod**: Input validation
- **Prisma**: SQL injection prevention

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

## 🚢 Deployment

### Environment Variables

See `backend/.env.example` for all required variables.

### Production Deployment

1. **Build images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Run migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml run api npm run db:migrate
   ```

3. **Start services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 📊 Monitoring

- **Health Check**: `GET /health`
- **Logs**: Winston (files + console)
- **Database**: Prisma query logging
- **Metrics**: Uptime, response times, error rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Phases

### Phase 1: MVP ✅ (Current)
- [x] User authentication
- [x] Basic character creation
- [x] Quest system (5 sample quests)
- [x] Photo/text verification
- [x] Core RPG mechanics
- [x] Basic UI/UX

### Phase 2: Core Features (Next)
- [ ] Advanced character customization
- [ ] Expanded quest library (50+ quests)
- [ ] AI verification improvements
- [ ] Achievements system
- [ ] Leaderboards
- [ ] Friends system

### Phase 3: Advanced Features
- [ ] Guild system
- [ ] Marketplace
- [ ] Video verification
- [ ] Analytics dashboard
- [ ] Mobile app

### Phase 4: Polish & Scale
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Beta testing
- [ ] Launch

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/femnixx/boredom-buster/issues)
- **Email**: support@boredombuster.app

## 🙏 Acknowledgments

- OpenAI for AI verification APIs
- Prisma for database ORM
- React team for the amazing framework
- All contributors and beta testers

---

Built with ❤️ by the Boredom Buster team

**Status**: 🚧 In Active Development | **Version**: 1.0.0-alpha