import Link from 'next/link';
import { ArrowRight, Check, Sparkles, ShoppingBag, Link as LinkIcon, ShieldCheck, Zap, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Header / Navbar */}
      <header className="w-full border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Link<span className="text-blue-500">Fácil</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/25 hover:shadow-blue-500/40"
            >
              Criar Minha Página
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Plataforma para Microempreendedores & Pequenos Negócios
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Centralize seus links e seu <span className="gradient-text">catálogo no WhatsApp</span> em uma única página
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Crie sua página personalizada no formato <code className="bg-slate-800 text-blue-300 px-2 py-0.5 rounded text-base">linkfacil.com/seu-negocio</code>. Organize redes sociais e receba pedidos no WhatsApp com 1 clique.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pizzaria-do-ze"
              target="_blank"
              className="w-full sm:w-auto text-base font-medium bg-slate-800 hover:bg-slate-700/80 text-slate-200 px-6 py-3.5 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              Ver Exemplo de Loja (Demo)
            </Link>
          </div>

          {/* Banner mockup preview */}
          <div className="mt-16 max-w-4xl mx-auto p-4 rounded-2xl glass-card border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="bg-slate-950/60 rounded-xl p-6 border border-slate-800/80 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg border-2 border-slate-800 mb-3">
                🍕
              </div>
              <h3 className="text-xl font-bold text-white">Pizzaria do Zé</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                As melhores pizzas artesanais da cidade! Entregas rápidas de terça a domingo.
              </p>

              <div className="w-full max-w-md mt-6 space-y-2.5">
                <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl font-medium text-sm text-blue-200 flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Fazer Pedido Direto no WhatsApp
                </div>
                <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl font-medium text-sm text-slate-300 flex items-center justify-center">
                  Cardápio em PDF
                </div>
                <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl font-medium text-sm text-slate-300 flex items-center justify-center">
                  Instagram @pizzariadoze
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-16 bg-slate-900/50 border-t border-b border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Tudo o que seu negócio precisa</h2>
              <p className="text-slate-400 mt-2">Simplicidade e eficiência sem complicações tecnológicas.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-2xl border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <LinkIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Gerenciador de Links</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Cadastre seus links importantes como Instagram, endereço no Google Maps e site oficial com ordenação personalizada.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Catálogo de Produtos (PRO)</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Exiba fotos, preços e descrições dos seus produtos ou serviços diretamente na sua página pública.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Checkout Direto no WhatsApp</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  O cliente clica no produto e já abre o WhatsApp com a mensagem pronta solicitando a compra.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Comparison Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white">Planos simples e transparentes</h2>
            <p className="text-slate-400 mt-2">Comece grátis e evolua quando seu negócio crescer.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Gratuito */}
            <div className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gratuito</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">R$ 0</span>
                  <span className="text-slate-400 ml-2">/para sempre</span>
                </div>
                <p className="text-slate-400 text-sm mt-3">Ideal para quem está começando agora.</p>

                <ul className="mt-8 space-y-4 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    Até 3 links simples
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    Slug personalizado (/sua-loja)
                  </li>
                  <li className="flex items-center gap-3 text-slate-500 line-through">
                    Catálogo de Produtos (Bloqueado)
                  </li>
                  <li className="flex items-center gap-3 text-slate-500 line-through">
                    Personalização de cores (Apenas padrão)
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-center transition-colors block"
              >
                Cadastrar Grátis
              </Link>
            </div>

            {/* Plano PRO */}
            <div className="glass-card p-8 rounded-2xl border-2 border-blue-500/80 relative flex flex-col justify-between shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
                Mais Popular
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Plano PRO</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">R$ 19,90</span>
                  <span className="text-slate-400 ml-2">/mês</span>
                </div>
                <p className="text-slate-400 text-sm mt-3">Para vender mais com catálogo profissional.</p>

                <ul className="mt-8 space-y-4 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <strong>Links Ilimitados</strong>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <strong>Catálogo Completo de Produtos</strong>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <strong>Pedidos no WhatsApp com 1 clique</strong>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <strong>Personalização de Cores Primárias</strong>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-center shadow-lg shadow-blue-600/30 transition-all block"
              >
                Testar Plano PRO
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} LinkFácil - Conectando pequenos negócios aos seus clientes.</p>
        </div>
      </footer>
    </div>
  );
}
