import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rts.trucla.id.vn'),
  title: {
    default: 'RTShop - Professional Website Builder',
    template: '%s | RTShop',
  },
  description: 'RTShop - Nhà cung cấp dịch vụ lập trình chuyên nghiệp - Professional application development service provider.',
  keywords: ['rtshop', 'mua sam online', 'shopping', 'website', 'webapp', 'ecommerce', 'vietnam'],
  creator: 'RTShop',
  category: 'E-commerce',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    url: 'https://rts.trucla.id.vn',
    title: 'RTShop - Professional application development',
    description: 'Nhà cung cấp dịch vụ lập trình chuyên nghiệp - Professional application development service provider',
    siteName: 'RTShop',
    images: [
      {
        url: '/img/logo.png',
        width: 1200,
        height: 630,
        alt: 'RTShop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RTShop - Professional application development',
    description: 'Nhà cung cấp dịch vụ lập trình chuyên nghiệp - Professional application development service provider',
    images: ['/img/logo.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/img/logo.png',
    apple: '/img/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var stored = localStorage.getItem('rtshop-theme');
                var theme = stored ? JSON.parse(stored).state?.theme : null;
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `}
        </Script>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'DM Sans, sans-serif',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#1d4ed8', secondary: 'white' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}