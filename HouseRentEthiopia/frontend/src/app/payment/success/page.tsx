'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams?.get('ref');
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) window.location.href = '/';
  }, [countdown]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-700"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">Payment completed!</h1>
      <p className="mt-2 text-zinc-600">
        Your payment request was received. The owner will confirm your booking shortly.
      </p>
      {ref && <p className="mt-3 font-mono text-xs text-zinc-400">Reference: {ref}</p>}
      <p className="mt-6 text-sm text-zinc-500">Redirecting to listings in {countdown}…</p>
      <Link href="/" className="mt-3 text-sm text-emerald-700 hover:underline">
        Go to listings now
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-md px-4 py-24 text-center text-zinc-500">Loading…</p>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}