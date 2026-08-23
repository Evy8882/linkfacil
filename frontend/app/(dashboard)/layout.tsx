'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Link as LinkIcon,
  LayoutDashboard,
  User,
  ShoppingBag,
  CreditCard,
  LogOut,
  ExternalLink,
  Crown,
  Sparkles
} from 'lucide-react';
import { fetchApi, removeAuthToken } from '@/lib/api';

interface UserData {
  id: string;
  name: string;
  email: string;
  storeName: string;
  slug: string;
  plan: 'FREE' | 'PRO';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ user: UserData }>('/auth/me')
      .then((res) => {
        setUser(res.user);
        setLoading(false);
      })
      .catch(() => {
        removeAuthToken();
        router.push('/login');
      });
  }, [router, pathname]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const titles: Record<string, string> = {
        '/dashboard': 'Visão Geral | Painel LinkFácil',
        '/dashboard/perfil': 'Perfil & Cores | Painel LinkFácil',
        '/dashboard/links': 'Gerenciador de Links | Painel LinkFácil',
        '/dashboard/catalogo': 'Catálogo de Produtos | Painel LinkFácil',
        '/dashboard/assinatura': 'Assinatura & Planos | Painel LinkFácil'
      };
      document.title = titles[pathname] || 'Painel do Lojista | LinkFácil';
    }
  }, [pathname]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando painel...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Perfil & Cores', href: '/dashboard/perfil', icon: User },
    { label: 'Links', href: '/dashboard/links', icon: LinkIcon },
    { label: 'Catálogo de Produtos', href: '/dashboard/catalogo', icon: ShoppingBag, isProFeature: true },
    { label: 'Assinatura', href: '/dashboard/assinatura', icon: CreditCard }
  ];

  const isPro = user?.plan === 'PRO';

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-slate-800 bg-[#0c101c] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <LinkIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Link<span className="text-blue-500">Fácil</span>
              </span>
            </Link>

            {/* Plan Badge */}
            {isPro ? (
              <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-md flex items-center gap-1">
                <Crown className="w-3 h-3" /> PRO
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium rounded-md">
                GRÁTIS
              </span>
            )}
          </div>

          {/* Business preview bar */}
          {user && (
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
              <p className="text-xs text-slate-400">Sua página pública:</p>
              <a
                href={`/${user.slug}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 truncate"
              >
                <span>linkfacil-rho.vercel.app/{user.slug}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.isProFeature && !isPro && (
                    <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
                      PRO
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Card if Free */}
        {!isPro && (
          <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 text-center">
            <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-white">Desbloqueie o Plano PRO</h4>
            <p className="text-[11px] text-slate-400 mt-1 mb-3">Links ilimitados e catálogo no WhatsApp.</p>
            <Link
              href="/dashboard/assinatura"
              className="block w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Simular Upgrade PRO
            </Link>
          </div>
        )}

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{user?.storeName}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl">
        {children}
      </main>
    </div>
  );
}
