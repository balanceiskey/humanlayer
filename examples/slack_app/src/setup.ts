import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Connect to the database
    await prisma.$connect();
    console.log('Connected to the database');
    
    // Test the database connection
    const tokenCount = await prisma.slackToken.count();
    console.log(`Database has ${tokenCount} tokens`);
    
    console.log('Setup completed successfully');
  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
