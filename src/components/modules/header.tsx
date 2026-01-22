import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, UserCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="bg-orange-600 p-1.5 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span>Certidão Fácil</span>
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <Link href="#" className="hover:text-orange-600 transition-colors">Serviços</Link>
          <Link href="#" className="hover:text-orange-600 transition-colors">Preços</Link>
          <Link href="#" className="hover:text-orange-600 transition-colors">Ajuda</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex text-slate-600">
            <UserCircle className="mr-2 h-4 w-4" />
            Minha Conta
          </Button>
          <Button size="sm">
            Novo Pedido
          </Button>
        </div>
      </div>
    </header>
  );
}