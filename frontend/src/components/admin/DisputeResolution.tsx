'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Dispute {
  id: string;
  bookingId: string;
  tenantName: string;
  landlordName: string;
  propertyTitle: string;
  reason: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  description: string;
}

interface DisputeResolutionProps {
  onResolve?: (disputeId: string, decision: string, refundAmount: number) => void;
}

export function DisputeResolution({ onResolve }: DisputeResolutionProps) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [decision, setDecision] = useState<'TENANT_WINS' | 'LANDLORD_WINS' | 'SPLIT'>('SPLIT');
  const [refundAmount, setRefundAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  useEffect(() => {
    // Simulate fetching disputes
    const mockDisputes: Dispute[] = [
      {
        id: '1',
        bookingId: 'booking1',
        tenantName: 'Jane Renter',
        landlordName: 'John Owner',
        propertyTitle: 'Beautiful Apartment',
        reason: 'Property condition',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        description: 'The property was not as described in the listing. The kitchen was damaged.',
      },
      {
        id: '2',
        bookingId: 'booking2',
        tenantName: 'Bob Tenant',
        landlordName: 'Alice Property',
        propertyTitle: 'Cozy Studio',
        reason: 'Unexpected charges',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        description: 'Landlord charged additional maintenance fees not mentioned in contract.',
      },
    ];
    setDisputes(mockDisputes);
    setIsLoading(false);
  }, []);

  const openDisputes = disputes.filter((d) => d.status === 'OPEN');

  const handleResolveDispute = () => {
    if (selectedDispute) {
      onResolve?.(selectedDispute.id, decision, refundAmount);
      setDisputes(disputes.map((d) => (d.id === selectedDispute.id ? { ...d, status: 'RESOLVED' } : d)));
      setShowResolutionModal(false);
      setDecision('SPLIT');
      setRefundAmount(0);
      setNotes('');
      setSelectedDispute(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total Disputes</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{disputes.length}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">Open Disputes</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{openDisputes.length}</p>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {openDisputes.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-3" />
            <p className="text-gray-900 font-medium">No open disputes</p>
            <p className="text-gray-500 text-sm mt-1">All disputes have been resolved</p>
          </div>
        ) : (
          openDisputes.map((dispute) => (
            <div key={dispute.id} className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{dispute.propertyTitle}</h3>
                    <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-medium">
                      OPEN
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {dispute.tenantName} vs {dispute.landlordName}
                  </p>

                  <div className="mb-3 p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 font-medium mb-1">Dispute Reason: {dispute.reason}</p>
                    <p className="text-sm text-gray-700">{dispute.description}</p>
                  </div>

                  <p className="text-xs text-gray-500">
                    Opened: {format(new Date(dispute.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedDispute(dispute);
                    setShowResolutionModal(true);
                  }}
                  className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors whitespace-nowrap"
                >
                  <CheckCircle className="h-4 w-4" />
                  Resolve
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && selectedDispute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolve Dispute</h3>

            <div className="space-y-4 mb-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium text-gray-900">{selectedDispute.propertyTitle}</p>
                <p className="text-xs text-gray-600">{selectedDispute.tenantName} vs {selectedDispute.landlordName}</p>
              </div>

              {/* Decision */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as typeof decision)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="TENANT_WINS">Tenant Wins</option>
                  <option value="LANDLORD_WINS">Landlord Wins</option>
                  <option value="SPLIT">Split Settlement</option>
                </select>
              </div>

              {/* Refund Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount (ETB)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain the resolution..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResolutionModal(false);
                  setSelectedDispute(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveDispute}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Resolve Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
