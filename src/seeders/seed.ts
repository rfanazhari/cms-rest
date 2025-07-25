import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../utils/database';
import User, { IUser } from '../models/User';
import Article, { ArticleStatus, IArticle } from '../models/Article';
import PageView, { IPageView } from '../models/PageView';

// Load environment variables
dotenv.config();

/**
 * Seed Users
 */
async function seedUsers(): Promise<IUser[]> {
  console.log('Seeding users...');
  
  // Create sample users
  const users = [
    {
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      googleId: `google_${new mongoose.Types.ObjectId().toString()}`, // Generate unique ID
      passwordHash: await bcrypt.hash('admin123', 10),
    },
    {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      googleId: `google_${new mongoose.Types.ObjectId().toString()}`, // Generate unique ID
      passwordHash: await bcrypt.hash('password123', 10),
    },
    {
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane.smith@example.com',
      googleId: `google_${new mongoose.Types.ObjectId().toString()}`, // Generate unique ID
      passwordHash: await bcrypt.hash('password123', 10),
    },
    {
      name: 'Bob Johnson',
      username: 'bobjohnson',
      email: 'bob.johnson@example.com',
      googleId: `google_${new mongoose.Types.ObjectId().toString()}`, // Generate unique ID
      passwordHash: await bcrypt.hash('password123', 10),
    },
    {
      name: 'Alice Williams',
      username: 'alicewilliams',
      email: 'alice.williams@example.com',
      googleId: `google_${new mongoose.Types.ObjectId().toString()}`, // Generate unique ID
      passwordHash: await bcrypt.hash('password123', 10),
    },
  ];

  // Insert users into the database
  const createdUsers = await User.insertMany(users);
  console.log(`${createdUsers.length} users seeded successfully`);
  
  return createdUsers;
}

/**
 * Seed Articles
 */
async function seedArticles(users: IUser[]): Promise<IArticle[]> {
  console.log('Seeding articles...');
  
  // Create sample articles
  const articles = [
    {
      status: ArticleStatus.PUBLISHED,
      title: 'Getting Started with TypeScript',
      content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It offers classes, modules, and interfaces to help you build robust components.',
      user: users[0]._id, // Admin user
    },
    {
      status: ArticleStatus.PUBLISHED,
      title: 'Introduction to MongoDB',
      content: 'MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.',
      user: users[0]._id, // Admin user
    },
    {
      status: ArticleStatus.DRAFT,
      title: 'Building RESTful APIs with Express',
      content: 'Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
      user: users[0]._id, // Admin user
    },
    {
      status: ArticleStatus.PUBLISHED,
      title: 'JavaScript Promises Explained',
      content: 'A promise is an object that may produce a single value some time in the future: either a resolved value, or a reason that it is not resolved.',
      user: users[1]._id, // John Doe
    },
    {
      status: ArticleStatus.DRAFT,
      title: 'Advanced TypeScript Techniques',
      content: 'This article covers advanced TypeScript features like conditional types, mapped types, and utility types.',
      user: users[1]._id, // John Doe
    },
    {
      status: ArticleStatus.PUBLISHED,
      title: 'Node.js Best Practices',
      content: 'Learn the best practices for building scalable and maintainable Node.js applications.',
      user: users[2]._id, // Jane Smith
    },
    {
      status: ArticleStatus.PUBLISHED,
      title: 'Introduction to JWT Authentication',
      content: 'JSON Web Token (JWT) is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.',
      user: users[2]._id, // Jane Smith
    },
    {
      status: ArticleStatus.DRAFT,
      title: 'React Hooks Tutorial',
      content: 'Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.',
      user: users[3]._id, // Bob Johnson
    },
    {
      status: ArticleStatus.PUBLISHED,
      title: 'GraphQL vs REST',
      content: 'Compare and contrast GraphQL and REST API architectures and learn when to use each one.',
      user: users[3]._id, // Bob Johnson
    },
    {
      status: ArticleStatus.PUBLISHED,
      title: 'Docker for Beginners',
      content: 'Learn how to containerize your applications with Docker and deploy them anywhere.',
      user: users[4]._id, // Alice Williams
    },
  ];

  // Insert articles into the database
  const createdArticles = await Article.insertMany(articles);
  console.log(`${createdArticles.length} articles seeded successfully`);
  
  // Use type assertion to ensure compatibility with IArticle[]
  return createdArticles as unknown as IArticle[];
}

/**
 * Seed Page Views
 */
async function seedPageViews(articles: IArticle[]): Promise<void> {
  console.log('Seeding page views...');
  
  // Create sample page views
  const pageViews = [];
  
  // Current date
  const now = new Date();
  
  // Generate page views for each published article
  for (const article of articles) {
    if (article.status === ArticleStatus.PUBLISHED) {
      // Generate random number of views (between 10 and 100)
      const viewCount = Math.floor(Math.random() * 91) + 10;
      
      for (let i = 0; i < viewCount; i++) {
        // Generate a random date within the last 30 days
        const randomDays = Math.floor(Math.random() * 30);
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        
        const viewDate = new Date(now);
        viewDate.setDate(viewDate.getDate() - randomDays);
        viewDate.setHours(viewDate.getHours() - randomHours);
        viewDate.setMinutes(viewDate.getMinutes() - randomMinutes);
        
        pageViews.push({
          article: article._id,
          viewedAt: viewDate,
        });
      }
    }
  }

  // Insert page views into the database
  const createdPageViews = await PageView.insertMany(pageViews);
  console.log(`${createdPageViews.length} page views seeded successfully`);
}

/**
 * Clear all data from the database
 */
async function clearDatabase(): Promise<void> {
  console.log('Clearing database...');
  
  await User.deleteMany({});
  await Article.deleteMany({});
  await PageView.deleteMany({});
  
  console.log('Database cleared successfully');
}

/**
 * Main seeder function
 */
async function seed(clear: boolean = true): Promise<void> {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing data if requested
    if (clear) {
      await clearDatabase();
    }
    
    // Seed the database
    const users = await seedUsers();
    const articles = await seedArticles(users);
    await seedPageViews(articles);
    
    console.log('Database seeded successfully');
    
    // Disconnect from the database
    await disconnectDB();
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    
    // Disconnect from the database
    await disconnectDB();
    
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const shouldClearDatabase = args.includes('--clear') || !args.includes('--no-clear');

// Run the seeder
seed(shouldClearDatabase);