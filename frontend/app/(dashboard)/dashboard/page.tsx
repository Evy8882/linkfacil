'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Link as LinkIcon, ShoppingBag, ShieldCheck, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface DashboardStats {
  user: {
    storeName: string;
    slug: string;
    plan: 'FREE' | 'PRO';
  };
  linkCount: number;
  productCount: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi('/auth/me'),
      fetchApi('/links'),
      fetchApi('/products').catch(() => ({ products: [] })) // Se FREE, o endpoint retorna erro 403
    ])
      .then(([meRes, linksRes, productsRes]) => {
        setStats({
          user: meRes.user,
          linkCount: linksRes.links?.length || 0,
          productCount: productsRes.products?.length || 0
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-slate-400 text-sm">Carregando informações...</div>;
  }

  const isPro = stats?.user.plan === 'PRO';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Bem-vindo, {stats?.user.storeName}! 👋</h1>
        <p className="text-sm text-slate-400 mt-1">
          Gerencie os links e produtos da sua página pública.
        </p>
      </div>

      {/* Public Page Quick Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sua Página Pública</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-bold text-white">linkfacil-rho.vercel.app/{stats?.user.slug}</span>
          </div>
        </div>

        <a
          href={`/${stats?.user.slug}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-600/25"
        >
          <span>Visualizar Minha Página</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Plan Status Banner */}
      {!isPro && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded border border-amber-500/30">
                PLANO GRATUITO
              </span>
              <span className="text-xs text-slate-400">Você tem algumas limitações ativas</span>
            </div>
            <h3 className="text-lg font-bold text-white">Desbloqueie o potencial máximo do seu negócio</h3>
            <p className="text-xs text-slate-300">
              No plano Gratuito você possui limite de 3 links e o módulo de Catálogo no WhatsApp fica bloqueado.
            </p>
          </div>

          <Link
            href="/dashboard/assinatura"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shrink-0 transition-all shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Simular Upgrade PRO
          </Link>
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Link Stat Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <LinkIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-400">
                {isPro ? 'Ilimitado (PRO)' : `${stats?.linkCount}/3 links usados`}
              </span>
            </div>
            <h3 className="text-3xl font-extrabold text-white">{stats?.linkCount}</h3>
            <p className="text-xs text-slate-400 mt-1">Links cadastrados ativos na página</p>
          </div>

          <Link
            href="/dashboard/links"
            className="mt-6 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Gerenciar Links <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Stat Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              {isPro ? (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Ativo (PRO)
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Bloqueado
                </span>
              )}
            </div>
            <h3 className="text-3xl font-extrabold text-white">
              {isPro ? stats?.productCount : 0}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Produtos no catálogo do WhatsApp</p>
          </div>

          <Link
            href="/dashboard/catalogo"
            className="mt-6 text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            {isPro ? 'Gerenciar Catálogo' : 'Ver Módulo do Catálogo'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
