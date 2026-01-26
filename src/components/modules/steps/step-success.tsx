"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Copy, Smartphone, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useOrder } from "@/contexts/order-context";
import { useRouter } from "next/navigation";

export function StepSuccess() {
  const { clearOrder, data } = useOrder();
  const router = useRouter();

  const pixCode = data.pixResponse?.code || "Erro ao carregar código PIX";
  const qrImage = data.pixResponse?.qrCodeUrl;

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60)

  useEffect(() => {
    if (timeLeft <= 0) {
      clearOrder();
      alert("O tempo para pagamento expirou. Por favor, inicie um novo pedido.");
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, clearOrder, router]);


  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto text-center space-y-8">
      
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Pedido Realizado!</h2>
        <p className="text-slate-500 text-lg">
          Pague agora para garantir a emissão imediata
        </p>
      </div>

      <Card className="border-orange-200 bg-orange-50/50 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-1 bg-red-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 900) * 100}%` }}
        />

        <CardContent className="pt-8 space-y-6">
          
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2 text-red-600 font-bold bg-red-100 px-3 py-1 rounded-full text-sm">
                <Clock className="h-4 w-4" />
                Expira em: {formatTime(timeLeft)}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 flex items-center justify-center gap-2">
              <Smartphone className="h-5 w-5 text-orange-600" />
              Pagamento via PIX
            </h3>
            <p className="text-sm text-slate-500">
              Escaneie o QR Code ou copie o código abaixo
            </p>
          </div>

          <div className="flex justify-center p-4 bg-white rounded-lg border border-slate-200 w-fit mx-auto shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrImage || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixCode}`} 
              alt="QR Code PIX" 
              className="h-48 w-48 mix-blend-multiply"
            />
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pix Copia e Cola</label>
            <div className="flex gap-2">
              <input 
                value={pixCode} 
                readOnly 
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-500 focus:outline-none"
              />
              <Button onClick={handleCopy} size="icon" variant="outline" className={copied ? "text-green-600 border-green-600" : ""}>
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-blue-100 text-blue-800 text-sm p-4 rounded-md">
            <p>Após o pagamento, você receberá a confirmação no seu <strong>WhatsApp</strong> em até 5 minutos.</p>
          </div>

        </CardContent>
      </Card>
      
      <button
        onClick={() => { clearOrder(); router.push('/'); }}
        className="text-sm text-slate-400 hover:text-red-500 underline transition-colors"
      >
        Cancelar pedido e voltar ao início
      </button>

      <p className="text-xs text-slate-400">
        Dúvidas? Entre em contato com nosso suporte no rodapé da página.
      </p>

    </div>
  );
}