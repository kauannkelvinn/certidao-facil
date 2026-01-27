"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, LogIn, LogOut, User } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="bg-orange-600 p-1.5 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span>Certidão Fácil</span>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <Link href="#" className="hover:text-orange-600 transition-colors">Serviços</Link>
          <Link href="#" className="hover:text-orange-600 transition-colors">Preços</Link>
          <Link href="#" className="hover:text-orange-600 transition-colors">Ajuda</Link>
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="Foto do usuário"
                    className="w-8 h-8 rounded-full border border-slate-200"
                  />
                ) : (
                  <div className="bg-slate-100 p-1.5 rounded-full">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                )}

                <div className="hidden md:block text-sm">
                  <p className="font-medium text-slate-900">
                    Olá, {session.user?.name?.split(' ')[0]}
                  </p>
                </div>
              </div>

              <Link href="/meus-pedidos">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  Meus Pedidos
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="text-slate-600 hover:text-orange-600 hidden md:flex">
                  Novo Pedido
                </Button>
              </Link>

              <Button
                onClick={() => signIn('google')}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}