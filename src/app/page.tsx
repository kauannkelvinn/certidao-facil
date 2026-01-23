"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, ShieldCheck, Clock, FileCheck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    localStorage.removeItem("certidao-facil-order");
    console.log("Sessão limpa para novo pedido");
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      
      <section className="relative bg-slate-900 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90" />
        
        <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-8">
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white max-w-4xl leading-tight">
            A certidão de matrícula do seu imóvel a alguns cliques
          </h1>
          
          <p className="text-slate-300 md:text-xl max-w-2xl">
            Solicite a segunda via da sua certidão de matrícula online e receba diretamente no seu WhatsApp ou E-mail.
          </p>

          <Card className="w-full max-w-4xl mt-8 shadow-2xl border-slate-700 bg-white/95 backdrop-blur-sm text-left">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-slate-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                Onde está localizado o imóvel?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-12 items-end">
                
                <div className="md:col-span-8 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Estado</label>
                    <select className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600">
                      <option value="" disabled defaultValue="">Selecione...</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="CE">Ceará</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Cidade</label>
                    <select className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600" disabled>
                      <option value="" disabled defaultValue="">Selecione...</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <Link href="/pedido" className="w-full">
                    <Button className="w-full h-12 font-bold shadow-lg text-base whitespace-nowrap" size="lg">
                      <Search className="mr-2 h-5 w-5" />
                      Começar Pedido
                    </Button>
                  </Link>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Entrega Rápida</h3>
            <p className="text-slate-500">
              Processamento ágil e envio digital. Receba sua certidão sem filas e sem burocracia.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">100% Seguro</h3>
            <p className="text-slate-500">
              Site verificado e transações protegidas. Seus dados e documentos com total sigilo.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <FileCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Validade Jurídica</h3>
            <p className="text-slate-500">
              As certidões têm a mesma validade legal das emitidas presencialmente no cartório.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}