import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'LinkFácil - Centralizador de Links & Catálogo no WhatsApp',
    template: '%s | LinkFácil'
  },
  description:
    'Crie sua página única e personalizada no formato linkfacil.com/sua-loja. Organize links de contato e exiba um catálogo de produtos integrado ao WhatsApp.',
  keywords: [
    'linkfacil',
    'centralizador de links',
    'link na bio',
    'catálogo no whatsapp',
    'cartão de visita digital',
    'mini catálogo',
    'pequenos negócios'
  ],
  authors: [{ name: 'LinkFácil' }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://linkfacil.com',
    title: 'LinkFácil - Centralizador de Links & Catálogo no WhatsApp',
    description:
      'Plataforma para pequenos negócios organizarem seus links e exibirem catálogo de produtos com pedidos diretos no WhatsApp.',
    siteName: 'LinkFácil'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkFácil - Centralizador de Links & Catálogo no WhatsApp',
    description: 'Crie sua página linkfacil.com/sua-loja em minutos.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100">{children}</body>
    </html>
  );
}
