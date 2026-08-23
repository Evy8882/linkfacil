'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Crown, Check, Sparkles, AlertCircle, Zap, RefreshCw } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface UserProfile {
  id: string;
  storeName: string;
  plan: 'FREE' | 'PRO';
}

export default function SubscriptionPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = () => {
    fetchApi<{ user: UserProfile }>('/auth/me')
      .then((res) => setUser(res.user))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulatePayment = async () => {
    setMessage(null);
    setToggling(true);

    try {
      const res = await fetchApi<{ message: string; user: UserProfile }>('/subscription/simulate-toggle', {
        method: 'POST'
      });

      setUser(res.user);
      setMessage({ type: 'success', text: res.message });
      // Força um reload suave das permissões
      window.dispatchEvent(new Event('storage'));
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao simular pagamento.' });
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400 text-sm">Carregando informações da assinatura...</div>;
  }

  const isPro = user?.plan === 'PRO';

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Assinatura & Planos</h1>
        <p className="text-sm text-slate-400 mt-1">
          Gerencie o estado da sua conta e simule a alteração de plano em tempo real.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Current Plan Status Box */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isPro
                ? 'bg-gradient-to-tr from-amber-500 to-purple-600 text-white shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isPro ? <Crown className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">Status Atual:</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isPro
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {isPro ? 'PLANO PRO ATIVO' : 'PLANO GRATUITO'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {isPro ? 'Você tem acesso ilimitado a todas as ferramentas!' : 'Sua conta está no plano básico.'}
            </h3>
          </div>
        </div>

        {/* Checkout Simulation Button */}
        <button
          onClick={handleSimulatePayment}
          disabled={toggling}
          className={`px-6 py-3 font-bold text-sm rounded-xl shadow-xl flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 shrink-0 ${
            isPro
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 shadow-amber-500/20'
          }`}
        >
          {toggling ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processando...
            </>
          ) : isPro ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Simular Voltar para Gratuito
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              Simular Pagamento PRO (Checkout Instantâneo)
            </>
          )}
        </button>
      </div>

      {/* Benefits Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Features Free */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-300 border-b border-slate-800 pb-3">
            Plano Gratuito
          </h3>

          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2.5 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              Até 3 links simples na página
            </li>
            <li className="flex items-center gap-2.5 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              Slug exclusivo linkfacil.com/sua-loja
            </li>
            <li className="flex items-center gap-2.5 text-slate-500 line-through">
              Catálogo de produtos (Bloqueado)
            </li>
            <li className="flex items-center gap-2.5 text-slate-500 line-through">
              Personalização de cores da página (Bloqueado)
            </li>
          </ul>
        </div>

        {/* Features PRO */}
        <div className="glass-card p-6 rounded-2xl border-2 border-amber-500/50 space-y-4 relative bg-gradient-to-b from-slate-900/90 to-amber-950/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Plano PRO
            </h3>
            <span className="text-xs font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
              Desbloqueio Imediato
            </span>
          </div>

          <ul className="space-y-3 text-sm text-slate-200">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <strong>Links Simples Ilimitados</strong>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <strong>Catálogo Completo de Produtos no WhatsApp</strong>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <strong>Edição de Cores Primárias da Página</strong>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <strong>Suporte Prioritário</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
