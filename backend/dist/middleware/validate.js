"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const apiError_1 = require("../utils/apiError");
const validate = (schema) => {
    return (req, _res, next) => {
        try {
            const result = schema.safeParse({
                body: req.body,
                params: req.params,
                query: req.query,
                cookies: req.cookies,
            });
            if (!result.success) {
                const errors = result.error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                throw apiError_1.ApiError.badRequest('Validation failed', errors);
            }
            if (result.data.body)
                req.body = result.data.body;
            if (result.data.params)
                req.params = result.data.params;
            if (result.data.query)
                req.query = result.data.query;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map