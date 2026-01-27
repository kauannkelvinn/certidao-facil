"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { FileText, Loader2, Calendar, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Pedido {
  id: number;
  data: string;
  nome: string;
  tipo: string;
  cartorio: string;
  status: string;
}

export default function MeusPedidosPage() {
  const { status } = useSession();
  
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (status === "authenticated") {
      fetchPedidos();
    }
  }, [status, router]);

  async function fetchPedidos() {
    try {
      const res = await fetch("/api/meus-pedidos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPedidos(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("pago") || s.includes("concluído") || s.includes("enviado")) return "bg-green-100 text-green-700 hover:bg-green-100";
    if (s.includes("cancelado")) return "bg-red-100 text-red-700 hover:bg-red-100";
    return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Meus Pedidos</h1>
        <Button onClick={() => router.push('/')} variant="outline">
          Novo Pedido
        </Button>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Nenhum pedido encontrado</h3>
          <p className="text-slate-500 mb-6">Você ainda não solicitou nenhuma certidão.</p>
          <Button onClick={() => router.push('/')} className="bg-orange-600 hover:bg-orange-700 text-white">
            Fazer meu primeiro pedido
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pedidos.map((pedido) => (
            <Link 
              key={pedido.id}
              href={`/pedido/${pedido.id}`}
              className="block cursor-pointer"
            >
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    Pedido #{pedido.id}
                  </CardTitle>
                  <Badge className={getStatusColor(pedido.status)}>
                    {pedido.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                      <span className="font-bold text-slate-900 capitalize">
                        {pedido.tipo === 'inteiro-teor' ? 'Inteiro Teor' : pedido.tipo}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <Building2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="line-clamp-2" title={pedido.cartorio}>
                        {pedido.cartorio}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t mt-2">
                      <Calendar className="h-3 w-3" />
                      {pedido.data}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}