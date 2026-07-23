# Boredom Buster - Backend API

Production-ready backend API for the Boredom Buster gamified RPG application.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+ (optional, for caching)
- OpenAI API key (for AI verification)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate

   # Seed database with sample data
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers (business logic)
│   ├── middleware/      # Express middleware (auth, errors, etc.)
│   ├── routes/          # API route definitions
│   ├── services/        # External service integrations
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seed script
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔐 Authentication

The API uses JWT-based authentication with refresh tokens.

### Getting Access Token

1. Register a new user:
   ```bash
   POST /api/auth/register
   {
     "email": "user@example.com",
     "username": "username",
     "password": "password123"
   }
   ```

2. Or login:
   ```bash
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. Use the returned `accessToken` in subsequent requests:
   ```
   Authorization: Bearer <accessToken>
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/me` - Get user profile
- `PATCH /api/users/me` - Update user profile
- `GET /api/users/me/inventory` - Get user inventory
- `POST /api/users/me/inventory/equip/:itemId` - Equip item
- `POST /api/users/me/inventory/unequip/:slot` - Unequip item
- `GET /api/users/leaderboard` - Get leaderboard

### Quests
- `GET /api/quests/available` - Get available quests
- `GET /api/quests/active` - Get active quests
- `POST /api/quests/accept` - Accept a quest
- `POST /api/quests/abandon` - Abandon a quest
- `GET /api/quests/:id` - Get quest details
- `GET /api/quests/history` - Get quest history

### Verifications
- `POST /api/verifications/photo` - Submit photo verification
- `POST /api/verifications/text` - Submit text verification
- `GET /api/verifications/:id/status` - Get verification status
- `GET /api/verifications` - Get user's verifications

### Social
- `POST /api/social/friends/request` - Send friend request
- `POST /api/social/friends/accept/:requestId` - Accept friend request
- `GET /api/social/friends` - Get friends list
- `GET /api/social/friends/requests` - Get pending requests
- `DELETE /api/social/friends/:friendId` - Remove friend
- `POST /api/social/guilds` - Create guild
- `GET /api/social/guilds` - Get guilds
- `POST /api/social/guilds/:guildId/join` - Join guild
- `POST /api/social/guilds/:guildId/leave` - Leave guild

### Economy
- `GET /api/economy/marketplace` - Get marketplace listings
- `POST /api/economy/marketplace/list` - List item for sale
- `POST /api/economy/marketplace/purchase/:listingId` - Purchase item
- `DELETE /api/economy/marketplace/:listingId` - Cancel listing
- `GET /api/economy/transactions` - Get transaction history

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests/minute, 5 auth requests/minute)
- JWT authentication with refresh tokens
- Password hashing with bcrypt (12 rounds)
- Input validation with Zod
- SQL injection prevention with Prisma ORM

## 🎮 Game Mechanics

### Level Progression
- XP required per level: `sqrt(totalXP / 100) + 1`
- Streak bonus: 10% additional rewards per consecutive day

### Quest Rewards
- Rewards are multiplied by streak bonus
- XP and gold are awarded on quest completion
- Automatic level-up calculation

### Character Classes
- WARRIOR: Bonus to strength-based tasks
- MAGE: Bonus to intelligence-based tasks
- ROGUE: Bonus to charisma-based tasks
- HEALER: Bonus to stamina-based tasks
- SAGE: Bonus to wisdom-based tasks

## 🤖 AI Verification

The API supports multiple verification types:

1. **Photo Verification**: Uses AI to analyze images
2. **Text Verification**: Validates text submissions
3. **Video Verification**: Analyzes video content (coming soon)
4. **Location Verification**: GPS-based verification (coming soon)

### AI Confidence Thresholds
- Photo: 90%+ for auto-approval
- Text: 80%+ for auto-approval (based on word count)
- Below threshold: Marked for human review

## 🗄️ Database Schema

See `prisma/schema.prisma` for the complete database schema.

### Key Models
- **User**: User accounts and authentication
- **Character**: RPG character data
- **Quest**: Quest definitions
- **UserQuest**: User's quest progress
- **Verification**: AI verification records
- **Guild**: Guild/party system
- **Achievement**: Achievement definitions
- **Transaction**: Economy transactions

## 🚢 Deployment

### Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: Refresh token signing secret
- `OPENAI_API_KEY`: OpenAI API key for AI verification
- `CLOUDINARY_*`: Cloudinary credentials for file uploads

### Docker Deployment

```bash
# Build image
docker build -t boredom-buster-api .

# Run container
docker run -p 3001:3001 --env-file .env boredom-buster-api
```

### Docker Compose

```bash
# Start all services (API + PostgreSQL + Redis)
docker-compose up -d

# View logs
docker-compose logs -f api
```

## 📊 Monitoring

- Health check: `GET /health`
- Winston logging to files and console
- Prisma query logging in development
- Error tracking with detailed context

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // Optional validation errors
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- GitHub Issues: https://github.com/femnixx/boredom-buster/issues
- Email: support@boredombuster.app

---

Built with ❤️ by the Boredom Buster team