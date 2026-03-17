/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
import mongoose from 'mongoose';
import http, { Server as HTTPServer } from 'http'; // ✅ import http
import app from './app';
import { errorLogger, logger } from './shared/logger';
import config from './config';
import mongoDBConnection from './config/mongoDB';
// import runCronJobEverydatAtNight from './helper/cronHelper';
import { initSocket } from './socket/socket.connection';

let myServer: HTTPServer | undefined;

// ✅ Create HTTP server from Express app
const server = http.createServer(app);

const port =
  typeof config.port === 'number' ? config.port : Number(config.port);

async function main() {
  try {
    // ✅ Database connection
    await mongoDBConnection();

    // ✅ Run cron job
    // runCronJobEverydatAtNight();
    // console.log("Cron job scheduled.");

    // ✅ Initialize socket with HTTP server
    initSocket(server);

    // ✅ Start server
    myServer = server.listen(port, () => {
      console.log(`We-mama server hitting : http://localhost:${port}`);
    });

    // ==============================
    // Global Error Handlers
    // ==============================

    process.on('unhandledRejection', (error) => {
      logger.error('Unhandled Rejection:', error);
    });

    process.on("uncaughtException", (error) => {
      errorLogger.error("Uncaught Exception", error);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received');
      if (myServer) {
        myServer.close(() => {
          logger.info('Server closed gracefully');
        });
      }
    });

  } catch (error) {
    errorLogger.error('Error in main function:', error);
    throw error;
  }
}

main().catch((err) => errorLogger.error('Main function error:', err));


// "scripts": {
//   "dev": "nodemon --watch src --exec tsx src/server.ts",
//   "build": "tsc",
//   "start": "node dist/server.js"
// }

