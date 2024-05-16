import { Inter } from 'next/font/google';
import clsx from 'clsx';
import { Suspense } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Catch a Pokemon Game',
  description: 'Calculate the closest Pokemon Trainer to a Pokemon in a grid',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={clsx(inter.className, 'h-full w-full')}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
