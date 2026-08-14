"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = __importDefault(require("./config/database"));
const server = http_1.default.createServer(app_1.default);
const startServer = async () => {
    try {
        // Verify database connection
        try {
            await database_1.default.$connect();
            console.log('✅ Database connected successfully');
        }
        catch (dbError) {
            console.warn('⚠️  Database connection failed, continuing in offline mode:', dbError.message);
            console.warn('   You can still run the API, but database operations will fail');
        }
        server.listen(env_1.env.PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${env_1.env.PORT}`);
            console.log(`📊 Environment: ${env_1.env.NODE_ENV}`);
            console.log(`🌐 Client URL: ${env_1.env.CLIENT_URL}\n`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await database_1.default.$disconnect();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
process.on('SIGTERM', async () => {
    console.log('\n🛑 SIGTERM received, shutting down...');
    await database_1.default.$disconnect();
    server.close(() => {
        process.exit(0);
    });
});
startServer();
//# sourceMappingURL=server.js.map