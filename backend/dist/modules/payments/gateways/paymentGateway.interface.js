"use strict";
/**
 * Abstract Payment Gateway Interface
 * All payment gateway implementations should extend this
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGateway = void 0;
class PaymentGateway {
    /**
     * Check if gateway supports currency
     */
    supportsCurrency(currency) {
        return this.supportedCurrencies.includes(currency);
    }
}
exports.PaymentGateway = PaymentGateway;
//# sourceMappingURL=paymentGateway.interface.js.map