import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const serif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '600', '700', '900'],
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Dispatch';
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Breaking news, business, markets`,
    template: `%s | ${siteName}`,
  },
  description: 'Independent reporting and analysis, written by contributors.',
  applicationName: siteName,
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    title: `${siteName} — Breaking news, business, markets`,
    description: 'Independent reporting and analysis, written by contributors.',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Independent reporting and analysis, written by contributors.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-white text-ink antialiased">
        <AuthProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
