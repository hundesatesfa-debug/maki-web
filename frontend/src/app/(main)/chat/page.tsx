import Link from 'next/link';
import { MessageCircle, LogIn } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Messages' };

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <MessageCircle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      <p className="mt-2 text-gray-500">
        Chat with property owners about listings. Sample conversations exist in the database — messaging UI is next to build.
      </p>
      <Link
        href={ROUTES.LOGIN}
        className={cn(buttonVariants(), 'mt-6 bg-emerald-600 hover:bg-emerald-700')}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Sign in to view messages
      </Link>
    </div>
  );
}
