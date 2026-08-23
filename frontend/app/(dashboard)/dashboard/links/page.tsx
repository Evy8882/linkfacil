'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, Plus, Trash2, Edit2, AlertCircle, Lock, ArrowUpRight, Sparkles } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface UserProfile {
  plan: 'FREE' | 'PRO';
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('FREE');
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = () => {
    Promise.all([fetchApi<{ links: LinkItem[] }>('/links'), fetchApi<{ user: UserProfile }>('/auth/me')])
      .then(([linksRes, userRes]) => {
        setLinks(linksRes.links || []);
        setUserPlan(userRes.user.plan);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (editingId) {
        await fetchApi(`/links/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ title, url })
        });
        setSuccess('Link atualizado com sucesso!');
      } else {
        await fetchApi('/links', {
          method: 'POST',
          body: JSON.stringify({ title, url })
        });
        setSuccess('Link adicionado com sucesso!');
      }

      setTitle('');
      setUrl('');
      setEditingId(null);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar link.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (link: LinkItem) => {
    setEditingId(link.id);
    setTitle(link.title);
    setUrl(link.url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este link?')) return;

    try {
      await fetchApi(`/links/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar link.');
    }
  };

  const isFree = userPlan === 'FREE';
  const isLimitReached = isFree && links.length >= 3;

  if (loading) {
    return <div className="text-slate-400 text-sm">Carregando links...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Gerenciador de Links</h1>
        <p className="text-sm text-slate-400 mt-1">
          Adicione e organize os links exibidos na sua página pública.
        </p>
      </div>

      {/* Plan Link Limit Banner */}
      {isFree && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Plano Gratuito: {links.length}/3 links cadastrados
              </p>
              <p className="text-[11px] text-slate-400">
                {isLimitReached
                  ? 'Você atingiu o limite de 3 links simples. Faça o upgrade para criar ilimitados!'
                  : 'Você pode cadastrar até 3 links simples no plano Gratuito.'}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/assinatura"
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Desbloquear Ilimitados
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4">
          {editingId ? 'Editar Link' : 'Adicionar Novo Link'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Título do Botão
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Siga no Instagram"
                disabled={!editingId && isLimitReached}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                URL de Destino
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://instagram.com/sualoja"
                disabled={!editingId && isLimitReached}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || (!editingId && isLimitReached)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Salvando...' : editingId ? 'Atualizar Link' : 'Adicionar Link'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setUrl('');
                }}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 text-sm rounded-xl hover:bg-slate-700"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of Links */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Seus Links Ativos ({links.length})</h2>

        {links.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center text-slate-400 text-sm">
            Nenhum link cadastrado ainda. Preencha o formulário acima para adicionar o primeiro.
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-white truncate">{link.title}</h4>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-blue-300 flex items-center gap-1 truncate"
                    >
                      <span>{link.url}</span>
                      <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
