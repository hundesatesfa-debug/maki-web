"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const listing_routes_1 = __importDefault(require("./modules/listings/listing.routes"));
const message_routes_1 = __importDefault(require("./modules/messages/message.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
const booking_routes_1 = __importDefault(require("./modules/bookings/booking.routes"));
const review_routes_1 = __importDefault(require("./modules/reviews/review.routes"));
const notification_routes_1 = __importDefault(require("./modules/notifications/notification.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const apiError_1 = require("./utils/apiError");
const apiResponse_1 = require("./utils/apiResponse");
const app = (0, express_1.default)();
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Global middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CLIENT_URL,
    credentials: true,
}));
app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(uploadsDir));
// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes (v1)
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/listings', listing_routes_1.default);
app.use('/api/v1/messages', message_routes_1.default);
app.use('/api/v1/payments', payment_routes_1.default);
app.use('/api/v1/bookings', booking_routes_1.default);
app.use('/api/v1/reviews', review_routes_1.default);
app.use('/api/v1/notifications', notification_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
// Error handling middleware
app.use((err, _req, res, _next) => {
    if (err instanceof apiError_1.ApiError) {
        return (0, apiResponse_1.sendError)(res, err.statusCode, err.message, err.data);
    }
    console.error('Unhandled error:', err);
    return (0, apiResponse_1.sendError)(res, 500, 'Internal server error');
});
exports.default = app;
//# sourceMappingURL=app.js.map