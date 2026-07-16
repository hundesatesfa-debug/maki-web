'use client';

import { useState } from 'react';
import { useSendMessage } from '@/hooks/useMessages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Send } from 'lucide-react';

interface MessageOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  ownerName: string;
  listingTitle: string;
}

export function MessageOwnerModal({
  isOpen,
  onClose,
  ownerId,
  ownerName,
  listingTitle,
}: MessageOwnerModalProps) {
  const [message, setMessage] = useState('');
  const sendMessage = useSendMessage();

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Please write a message');
      return;
    }

    if (!ownerId || ownerId.length === 0) {
      alert('Owner information is missing');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        receiverId: ownerId,
        content: message.trim(),
      });

      setMessage('');
      onClose();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Message {ownerName}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">About:</span> {listingTitle}
          </p>
        </div>

        <div className="mb-4">
          <Label htmlFor="message">Your Message</Label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            placeholder="Write your message here... (min 1, max 500 characters)"
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            rows={4}
            maxLength={500}
          />
          <p className="mt-1 text-xs text-gray-500">
            {message.length}/500 characters
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sendMessage.isPending || !message.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Send className="h-4 w-4" />
            {sendMessage.isPending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}
