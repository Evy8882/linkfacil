'use client';

import { useState, useEffect, use } from 'react';
import { ShoppingBag, MessageSquare, ExternalLink, ArrowUpRight, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface PublicStoreData {
  storeName: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  whatsappNumber: string;
  primaryColor: string;
  plan: 'FREE' | 'PRO';
  links: {
    id: string;
    title: string;
    url: string;
    icon?: string;
  }[];
  products: {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    customMessage?: string;
  }[];
}

export default function PublicStorePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [store, setStore] = useState<PublicStoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApi<{ store: PublicStoreData }>(`/public/${resolvedParams.slug}`)
      .then((res) => {
        setStore(res.store);
        if (typeof document !== 'undefined') {
          document.title = `${res.store.storeName} | LinkFácil`;
        }
      })
      .catch((err) => setError(err.message || 'Loja não encontrada.'))
      .finally(() => setLoading(false));
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando página...</span>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Negócio não encontrado</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-md">
          A página <code className="text-blue-400">/{resolvedParams.slug}</code> não existe ou foi desativada.
        </p>
        <a
          href="/"
          className="mt-6 px-5 py-2.5 bg-slate-800 text-white font-medium text-sm rounded-xl hover:bg-slate-700 transition-colors"
        >
          Ir para a Página Inicial
        </a>
      </div>
    );
  }

  const primaryColor = store.primaryColor || '#2563EB';

  const generateWhatsappUrl = (productName?: string, customMessage?: string) => {
    const cleanPhone = store.whatsappNumber.replace(/\D/g, '');
    let text = '';

    if (productName) {
      text = customMessage
        ? customMessage
        : `Olá! Tenho interesse no produto *${productName}*. Pode me passar mais informações?`;
    } else {
      text = `Olá! Encontrei seu negócio no LinkFácil e gostaria de falar com vocês.`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar / Logo */}
          {store.avatarUrl ? (
            <img
              src={store.avatarUrl}
              alt={store.storeName}
              className="w-24 h-24 rounded-full object-cover border-4 shadow-xl"
              style={{ borderColor: primaryColor }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-xl border-4"
              style={{ backgroundColor: primaryColor, borderColor: 'rgba(255,255,255,0.2)' }}
            >
              {store.storeName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{store.storeName}</h1>
            {store.bio && <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{store.bio}</p>}
          </div>

          {/* Quick WhatsApp Contact Button */}
          {store.whatsappNumber && (
            <a
              href={generateWhatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              Falar no WhatsApp
            </a>
          )}
        </div>

        {/* Simple Links Section */}
        {store.links.length > 0 && (
          <div className="space-y-3">
            {store.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {link.title}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        )}

        {/* Product Catalog Section (Visible if PRO and has products) */}
        {store.plan === 'PRO' && store.products.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Nosso Catálogo</h2>
            </div>

            <div className="grid gap-4">
              {store.products.map((product) => (
                <div
                  key={product.id}
                  className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white leading-tight">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
                      )}
                      <p className="text-sm font-extrabold text-emerald-400 pt-1">
                        R$ {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <a
                    href={generateWhatsappUrl(product.name, product.customMessage || undefined)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Pedir este produto no WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer LinkFácil Attribution */}
        <div className="pt-8 text-center border-t border-slate-800/60">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            <span>Criado com</span>
            <strong className="text-slate-300">LinkFácil</strong>
          </a>
        </div>
      </div>
    </div>
  );
}
