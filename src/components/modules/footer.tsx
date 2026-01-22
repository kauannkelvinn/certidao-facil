import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 text-slate-600 text-sm">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">Certidão Fácil</h4>
          <p className="leading-relaxed text-slate-500">
            A forma mais rápida e segura de emitir suas certidões de cartório online. Entregamos direto no seu WhatsApp.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">Serviços</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:underline">Certidão de Inteiro Teor</Link></li>
            <li><Link href="#" className="hover:underline">Certidão de Ônus</Link></li>
            <li><Link href="#" className="hover:underline">Pesquisa de Bens</Link></li>
            <li><Link href="#" className="hover:underline">Acompanhar Pedido</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">Suporte</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:underline">Central de Ajuda</Link></li>
            <li><Link href="#" className="hover:underline">Fale Conosco (WhatsApp)</Link></li>
            <li><Link href="#" className="hover:underline">Termos de Uso</Link></li>
            <li><Link href="#" className="hover:underline">Política de Privacidade</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">Pagamento Seguro</h4>
          <div className="flex gap-2">
             <div className="bg-white border rounded px-3 py-1 text-xs font-bold text-slate-500">PIX</div>
             <div className="bg-white border rounded px-3 py-1 text-xs font-bold text-slate-500">Cartão</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-12 px-4 md:px-6 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
        © 2026 Certidão Fácil. Todos os direitos reservados.
      </div>
    </footer>
  );
}