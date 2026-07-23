import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample quests
  const quests = await prisma.quest.createMany({
    data: [
      {
        title: 'Morning Energizer',
        description: 'Complete 10 minutes of stretching or light exercise to start your day',
        difficulty: 'EASY',
        type: 'DAILY',
        xpReward: 50,
        goldReward: 25,
        isActive: true,
        isPremium: false,
        steps: {
          create: [
            {
              stepNumber: 1,
              description: 'Find a comfortable space for stretching',
              verificationType: 'PHOTO',
              targetValue: 1,
            },
            {
              stepNumber: 2,
              description: 'Complete 10 minutes of stretching or exercise',
              verificationType: 'PHOTO',
              targetValue: 1,
            },
            {
              stepNumber: 3,
              description: 'Submit verification photo',
              verificationType: 'PHOTO',
              targetValue: 1,
            },
          ],
        },
      },
      {
        title: 'Knowledge Seeker',
        description: 'Read an educational article and write a summary',
        difficulty: 'MEDIUM',
        type: 'DAILY',
        xpReward: 100,
        goldReward: 50,
        isActive: true,
        isPremium: false,
        steps: {
          create: [
            {
              stepNumber: 1,
              description: 'Read an educational article (minimum 500 words)',
              verificationType: 'TEXT',
              targetValue: 1,
            },
            {
              stepNumber: 2,
              description: 'Write a summary of at least 50 words',
              verificationType: 'TEXT',
              targetValue: 1,
            },
          ],
        },
      },
      {
        title: 'Hydration Hero',
        description: 'Drink 8 glasses of water throughout the day',
        difficulty: 'EASY',
        type: 'HABIT',
        xpReward: 30,
        goldReward: 15,
        isActive: true,
        isPremium: false,
        isRepeatable: true,
        cooldownHours: 24,
        steps: {
          create: [
            {
              stepNumber: 1,
              description: 'Drink your first glass of water',
              verificationType: 'PHOTO',
              targetValue: 1,
            },
            {
              stepNumber: 2,
              description: 'Drink 8 glasses of water total',
              verificationType: 'PHOTO',
              targetValue: 8,
            },
          ],
        },
      },
      {
        title: 'Social Butterfly',
        description: 'Connect with a friend or family member',
        difficulty: 'EASY',
        type: 'DAILY',
        xpReward: 40,
        goldReward: 20,
        isActive: true,
        isPremium: false,
        steps: {
          create: [
            {
              stepNumber: 1,
              description: 'Call, text, or meet with a friend or family member',
              verificationType: 'TEXT',
              targetValue: 1,
            },
            {
              stepNumber: 2,
              description: 'Write about your interaction (minimum 30 words)',
              verificationType: 'TEXT',
              targetValue: 1,
            },
          ],
        },
      },
      {
        title: 'Fitness Journey Begins',
        description: 'Complete a 20-minute workout session',
        difficulty: 'MEDIUM',
        type: 'SIDE',
        xpReward: 150,
        goldReward: 75,
        isActive: true,
        isPremium: false,
        steps: {
          create: [
            {
              stepNumber: 1,
              description: 'Warm up for 5 minutes',
              verificationType: 'PHOTO',
              targetValue: 1,
            },
            {
              stepNumber: 2,
              description: 'Complete 15 minutes of exercise',
              verificationType: 'PHOTO',
              targetValue: 1,
            },
            {
              stepNumber: 3,
              description: 'Cool down and stretch',
              verificationType: 'PHOTO',
              targetValue: 1,
            },
          ],
        },
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created sample quests');

  // Create sample items
  const items = await prisma.item.createMany({
    data: [
      {
        name: 'Rusty Sword',
        description: 'A basic sword for beginners',
        type: 'WEAPON',
        rarity: 'COMMON',
        slot: 'MAIN_HAND',
        stats: { strength: 3 },
        iconUrl: '/icons/weapons/rusty_sword.png',
      },
      {
        name: 'Apprentice Staff',
        description: 'A simple staff for magic users',
        type: 'WEAPON',
        rarity: 'UNCOMMON',
        slot: 'MAIN_HAND',
        stats: { intelligence: 5, wisdom: 2 },
        iconUrl: '/icons/weapons/apprentice_staff.png',
      },
      {
        name: 'Leather Armor',
        description: 'Basic leather protection',
        type: 'ARMOR',
        rarity: 'COMMON',
        slot: 'CHEST',
        stats: { stamina: 2 },
        iconUrl: '/icons/armor/leather_armor.png',
      },
      {
        name: 'Health Potion',
        description: 'Restores health (just for fun!)',
        type: 'CONSUMABLE',
        rarity: 'COMMON',
        stats: {},
        iconUrl: '/icons/consumables/health_potion.png',
      },
      {
        name: 'Warrior Helmet',
        description: 'A sturdy helmet for warriors',
        type: 'ARMOR',
        rarity: 'RARE',
        slot: 'HEAD',
        stats: { strength: 5, stamina: 3 },
        iconUrl: '/icons/armor/warrior_helmet.png',
      },
      {
        name: 'Ring of Wisdom',
        description: 'Enhances magical abilities',
        type: 'ACCESSORY',
        rarity: 'EPIC',
        slot: 'RING',
        stats: { intelligence: 8, wisdom: 5 },
        iconUrl: '/icons/accessories/ring_of_wisdom.png',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created sample items');

  // Create sample achievements
  const achievements = await prisma.achievement.createMany({
    data: [
      {
        name: 'First Steps',
        description: 'Complete your first quest',
        rarity: 'COMMON',
        category: 'QUESTS',
        criteria: { type: 'quests_completed', value: 1 },
        rewards: { xp: 100, gold: 50 },
      },
      {
        name: 'Quest Master',
        description: 'Complete 50 quests',
        rarity: 'RARE',
        category: 'QUESTS',
        criteria: { type: 'quests_completed', value: 50 },
        rewards: { xp: 1000, gold: 500, gems: 10 },
      },
      {
        name: 'Dedicated Hero',
        description: 'Maintain a 7-day streak',
        rarity: 'EPIC',
        category: 'SPECIAL',
        criteria: { type: 'streak_days', value: 7 },
        rewards: { xp: 500, gold: 250, gems: 5 },
      },
      {
        name: 'Social Butterfly',
        description: 'Add 10 friends',
        rarity: 'UNCOMMON',
        category: 'SOCIAL',
        criteria: { type: 'friends_count', value: 10 },
        rewards: { xp: 300, gold: 150 },
      },
      {
        name: 'Guild Leader',
        description: 'Create a guild',
        rarity: 'RARE',
        category: 'SOCIAL',
        criteria: { type: 'guilds_created', value: 1 },
        rewards: { xp: 500, gold: 200 },
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created sample achievements');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });