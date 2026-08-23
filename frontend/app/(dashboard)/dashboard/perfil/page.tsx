'use client';

import { useState, useEffect } from 'react';
import { User, Palette, Lock, Check, Save, AlertCircle, Sparkles } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  storeName: string;
  slug: string;
  bio: string;
  avatarUrl: string;
  whatsappNumber: string;
  primaryColor: string;
  plan: 'FREE' | 'PRO';
}

const PRESET_COLORS = [
  { name: 'Azul Padrão', hex: '#2563EB' },
  { name: 'Roxo Vibrante', hex: '#7C3AED' },
  { name: 'Rosa Chiclete', hex: '#DB2777' },
  { name: 'Verde WhatsApp', hex: '#16A34A' },
  { name: 'Laranja Flame', hex: '#EA580C' },
  { name: 'Preto Elegante', hex: '#18181B' }
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [storeName, setStoreName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchApi<{ user: UserProfile }>('/profile')
      .then((res) => {
        const u = res.user;
        setProfile(u);
        setStoreName(u.storeName || '');
        setBio(u.bio || '');
        setAvatarUrl(u.avatarUrl || '');
        setWhatsappNumber(u.whatsappNumber || '');
        setPrimaryColor(u.primaryColor || '#2563EB');
      })
      .catch((err) => {
        console.error('Erro ao carregar perfil:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetchApi<{ user: UserProfile; message: string }>('/profile', {
        method: 'PUT',
        body: JSON.stringify({
          storeName,
          bio,
          avatarUrl,
          whatsappNumber: whatsappNumber.replace(/\D/g, ''),
          primaryColor
        })
      });

      setProfile(res.user);
      setPrimaryColor(res.user.primaryColor || primaryColor);
      setMessage({ type: 'success', text: res.message || 'Perfil salvo com sucesso!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao atualizar perfil.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando dados do perfil...</span>
        </div>
      </div>
    );
  }

  const isPro = profile?.plan === 'PRO';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Perfil da Loja & Personalização</h1>
        <p className="text-sm text-slate-400 mt-1">
          Altere suas informações e personalize a identidade visual da sua página.
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Informações Principais</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Nome do Negócio
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Nome da sua loja"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                WhatsApp com DDD (para pedidos)
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="5511999999999"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Biografia / Descrição da Loja
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ex: As melhores pizzas da cidade. Entregas rápidas de terça a domingo das 18h às 23h."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                URL da Foto / Logotipo
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://sua-imagem-aqui.com/logo.jpg"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Customização de Cores (PRO Feature) */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Cor Primária da Página</h2>
            </div>

            {!isPro ? (
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-lg flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> RECURSO PRO
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> DESBLOQUEADO
              </span>
            )}
          </div>

          {!isPro && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center justify-between">
              <span>A personalização das cores da página é um recurso exclusivo do Plano PRO.</span>
              <Link
                href="/dashboard/assinatura"
                className="ml-2 font-bold underline hover:text-amber-200"
              >
                Simular PRO
              </Link>
            </div>
          )}

          <div className={`space-y-6 ${!isPro ? 'opacity-50 pointer-events-none' : ''}`}>
            <p className="text-xs text-slate-400">
              Escolha uma das cores pré-definidas abaixo ou selecione qualquer cor personalizada:
            </p>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_COLORS.map((c) => {
                const isSelected = primaryColor.toUpperCase() === c.hex.toUpperCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setPrimaryColor(c.hex)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-white bg-slate-800 ring-2 ring-blue-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="text-xs font-medium text-white truncate">{c.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-white ml-auto" />}
                  </button>
                );
              })}
            </div>

            {/* Selector de Cor Customizada (Color Picker & Hex input) */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-4">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider shrink-0">
                Cor Personalizada:
              </label>
              <div className="flex items-center gap-3 w-full max-w-xs">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#2563EB"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500 uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
