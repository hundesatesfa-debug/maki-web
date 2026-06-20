import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'House Rent Ethiopia — Find Your Perfect Home',
    template: '%s | House Rent Ethiopia',
  },
  description:
    'Discover and rent houses across Ethiopia. Browse apartments, villas, condos, and more. Connect directly with house owners.',
  keywords: [
    'house rent',
    'ethiopia',
    'apartment',
    'rental',
    'addis ababa',
    'property',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
