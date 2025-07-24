// Main application entry point
require('dotenv').config();

const Scheduler = require('./modules/scheduler');
const CLIInterface = require('./cli/interface');

console.log('🐦 Twitter Scheduler Starting...\n');

// Initialize scheduler
const scheduler = new Scheduler();

// // Add your 3AM tweet (your original request)
// scheduler.addTweet(
//   '🚀 Just deployed my new Twitter scheduler built with Node.js and Puppeteer! Automation is the future. #coding #nodejs #automation #tech',
//   '2025-07-24 03:00:00'
// );

// Start scheduler automatically
scheduler.start();

// Initialize CLI interface
const cli = new CLIInterface(scheduler);
cli.start();

// Handle graceful shutdown on Ctrl+C
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down gracefully...');
  await scheduler.cleanup();
  process.exit(0);
});

// Handle termination signal
process.on('SIGTERM', async () => {
  console.log('\n🛑 Received termination signal...');
  await scheduler.cleanup();
  process.exit(0);
});

// Handle unexpected errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});