'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, Edit2, Lock, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  customMessage: string;
  order: number;
  isActive: boolean;
}

interface UserProfile {
  plan: 'FREE' | 'PRO';
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const meRes = await fetchApi<{ user: UserProfile }>('/auth/me');
      const userIsPro = meRes.user.plan === 'PRO';
      setIsPro(userIsPro);

      if (userIsPro) {
        const prodRes = await fetchApi<{ products: Product[] }>('/products');
        setProducts(prodRes.products || []);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar catálogo.');
    } finally {
      setLoading(false);
    }
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
        await fetchApi(`/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({
            name,
            description,
            price: parseFloat(price),
            imageUrl,
            customMessage
          })
        });
        setSuccess('Produto atualizado no catálogo com sucesso!');
      } else {
        await fetchApi('/products', {
          method: 'POST',
          body: JSON.stringify({
            name,
            description,
            price: parseFloat(price),
            imageUrl,
            customMessage
          })
        });
        setSuccess('Produto adicionado ao catálogo!');
      }

      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setCustomMessage('');
    setEditingId(null);
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description || '');
    setPrice(p.price.toString());
    setImageUrl(p.imageUrl || '');
    setCustomMessage(p.customMessage || '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este produto do catálogo?')) return;

    try {
      await fetchApi(`/products/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar produto.');
    }
  };

  if (loading) {
    return <div className="text-slate-400 text-sm">Carregando catálogo...</div>;
  }

  // --- Caso o usuário seja FREE (Módulo Bloqueado) ---
  if (!isPro) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Catálogo de Produtos</h1>
          <p className="text-sm text-slate-400 mt-1">
            Exiba produtos e receba pedidos pré-formatados direto no seu WhatsApp.
          </p>
        </div>

        <div className="glass-card p-10 rounded-2xl border border-amber-500/30 text-center max-w-2xl mx-auto space-y-6 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-amber-950/20">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Módulo do Catálogo Bloqueado</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              O cadastro de produtos com botões de compra direta no WhatsApp é um recurso exclusivo do <strong className="text-amber-400">Plano PRO</strong>.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/assinatura"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Simular Assinatura PRO Agora
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Caso o usuário seja PRO (Módulo Liberado) ---
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Catálogo de Produtos (PRO)</h1>
          <p className="text-sm text-slate-400 mt-1">
            Cadastre os itens da sua vitrine virtual.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> RECURSO PRO ATIVO
        </span>
      </div>

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

      {/* Add / Edit Product Form */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">
          {editingId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nome do Produto
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pizza Calabresa Familiar"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.90"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Descrição Curta (Opcional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Molho caseiro, queijo mussarela, calabresa fatiada e orégano fresco"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                URL da Foto do Produto
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://sua-imagem.com/pizza.jpg"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mensagem Customizada para WhatsApp (Opcional)
              </label>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Deixe em branco para usar a mensagem padrão"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl shadow-md shadow-purple-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Salvando...' : editingId ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 text-sm rounded-xl hover:bg-slate-700"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of Products */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Produtos no Catálogo ({products.length})</h2>

        {products.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center text-slate-400 text-sm">
            Nenhum produto cadastrado no catálogo ainda.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-bold text-white leading-tight">{p.name}</h4>
                    <span className="text-sm font-extrabold text-emerald-400 shrink-0">
                      R$ {p.price.toFixed(2)}
                    </span>
                  </div>

                  {p.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-emerald-400" /> WhatsApp ativo
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
