'use client';

import { Check, Globe, Smartphone, CreditCard } from 'lucide-react';

export type PaymentMethod = 'TELEBIRR' | 'PAYPAL' | 'STRIPE' | 'BANK_TRANSFER';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'TELEBIRR' as PaymentMethod,
    name: 'Telebirr',
    description: 'Mobile money - Ethiopia',
    icon: Smartphone,
    badge: 'Recommended',
  },
  {
    id: 'PAYPAL' as PaymentMethod,
    name: 'PayPal',
    description: 'International payments - USD',
    icon: Globe,
    badge: 'International',
  },
  {
    id: 'STRIPE' as PaymentMethod,
    name: 'Card',
    description: 'Visa, Mastercard, Amex',
    icon: CreditCard,
    badge: 'Secure',
  },
  {
    id: 'BANK_TRANSFER' as PaymentMethod,
    name: 'Bank Transfer',
    description: 'Direct bank transfer - Manual',
    icon: CreditCard,
    badge: 'Fallback',
  },
];

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment Method</h3>

      <div className="grid gap-3">
        {PAYMENT_METHODS.map(({ id, name, description, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex items-start gap-4 rounded-lg border-2 p-4 transition-all ${
              selected === id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex-shrink-0">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selected === id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{name}</h4>
                <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                  {badge}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>

            {selected === id && (
              <div className="flex-shrink-0 pt-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
