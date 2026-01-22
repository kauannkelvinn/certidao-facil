import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, ShieldCheck, Clock, FileCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      
      <section className="relative bg-slate-900 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90" />
        
        <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white max-w-3xl">
            Todos os Cartórios de Registro de Imóveis do Brasil em um só lugar
          </h1>
          <p className="text-slate-300 md:text-xl max-w-2xl">
            Solicite a segunda via da sua certidão de matrícula online e receba diretamente no seu WhatsApp ou E-mail.
          </p>

          <Card className="w-full max-w-3xl mt-8 shadow-2xl border-slate-700 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-slate-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                Onde está localizado o imóvel?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-3 grid grid-cols-2 gap-4">
                  <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600">
                    <option value="" disabled defaultValue="">Selecione o Estado (UF)</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="CE">Ceará</option>
                  </select>

                  <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600" disabled>
                    <option value="" disabled defaultValue="">Selecione a Cidade</option>
                  </select>
                </div>

                <Button className="w-full font-bold shadow-lg" size="lg" type="button">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
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