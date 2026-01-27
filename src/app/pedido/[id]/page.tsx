"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// CORREÇÃO 1: Removemos Smartphone que não estava sendo usado
import { CheckCircle2, Copy, Clock, ArrowLeft, Loader2 } from "lucide-react";

// CORREÇÃO 2: Definimos a "cara" do nosso Pedido para tirar o 'any'
interface Pedido {
  id: number;
  data: string;
  nome: string;
  tipo: string;
  cartorio: string;
  status: string;
  pixCopiaCola?: string;
  pixUrl?: string;
}

export default function DetalhesPedidoPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // CORREÇÃO 3: Usamos o tipo Pedido | null
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPedido() {
      try {
        const res = await fetch("/api/meus-pedidos");
        const data = await res.json();
        
        // CORREÇÃO 4: Tipamos 'p' como Pedido e comparamos convertendo o ID para número
        const item = data.find((p: Pedido) => p.id === Number(id));
        
        if (item) {
           setPedido(item);
           calcularTempoRestante(item.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadPedido();
  }, [id]);

  function calcularTempoRestante(dataString: string) {
    const [datePart, timePart] = dataString.split(', ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    
    const pedidoDate = new Date(year, month - 1, day, hours, minutes, seconds);
    const validUntil = new Date(pedidoDate.getTime() + 15 * 60000); 
    
    const now = new Date();
    const diffSeconds = Math.floor((validUntil.getTime() - now.getTime()) / 1000);
    
    setTimeLeft(diffSeconds > 0 ? diffSeconds : 0);
  }

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCopy = () => {
    if(pedido?.pixCopiaCola) {
        navigator.clipboard.writeText(pedido.pixCopiaCola);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-600"/></div>;

  if (!pedido) return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-slate-500">Pedido não encontrado</p>
        <Button variant="outline" onClick={() => router.push('/meus-pedidos')}>Voltar para lista</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 gap-2">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Button>

      <div className="space-y-4 text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Pedido #{pedido.id}</h2>
        <p className="text-slate-500 capitalize">{pedido.tipo === 'inteiro-teor' ? 'Inteiro Teor' : pedido.tipo}</p>
        <p className="text-sm text-slate-400">{pedido.cartorio}</p>
      </div>

      <Card className="border-orange-200 bg-orange-50/50 relative overflow-hidden">
        {timeLeft > 0 && (
             <div 
             className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-1000 ease-linear"
             style={{ width: `${(timeLeft / 900) * 100}%` }}
           />
        )}
       
        <CardContent className="pt-8 space-y-6">
          
          {timeLeft > 0 ? (
             <>
                <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="flex items-center gap-2 text-red-600 font-bold bg-red-100 px-3 py-1 rounded-full text-sm">
                        <Clock className="h-4 w-4" />
                        Expira em: {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex justify-center p-4 bg-white rounded-lg border border-slate-200 w-fit mx-auto shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                    src={pedido.pixUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pedido.pixCopiaCola}`} 
                    alt="QR Code PIX" 
                    className="h-48 w-48 mix-blend-multiply"
                    />
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pix Copia e Cola</label>
                    <div className="flex gap-2">
                    <input 
                        value={pedido.pixCopiaCola} 
                        readOnly 
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-500 focus:outline-none"
                    />
                    <Button onClick={handleCopy} size="icon" variant="outline" className={copied ? "text-green-600 border-green-600" : ""}>
                        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    </div>
                </div>
             </>
          ) : (
            <div className="text-center py-8 text-slate-500">
                <Clock className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p>O tempo para pagamento deste QR Code expirou.</p>
                <p className="text-sm">Por favor, faça um novo pedido.</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}