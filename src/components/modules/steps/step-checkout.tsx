"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOrder } from "@/contexts/order-context";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  nome: z.string().min(3, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp é obrigatório para entrega"),
});

type FormData = z.infer<typeof formSchema>;

export function StepCheckout() {
  const { data, nextStep } = useOrder();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: data.dadosPessoais.nome,
      cpf: data.dadosPessoais.cpf,
      email: data.dadosPessoais.email,
      whatsapp: data.dadosPessoais.whatsapp,
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  function onSubmit(formData: FormData) {
    console.log("Dados finais:", { ...data, dadosPessoais: formData });
    nextStep(); 
  }

  const PRECO_CERTIDAO = 59.90;
  const TAXA_SERVICO = 19.90;
  const TOTAL = PRECO_CERTIDAO + TAXA_SERVICO;

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-orange-600" />
              Seus Dados para Entrega
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <Input {...register("nome")} placeholder="Nome igual ao documento" error={!!errors.nome} />
                {errors.nome && <span className="text-xs text-red-500">{errors.nome.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CPF</label>
                <Input {...register("cpf")} placeholder="000.000.000-00" error={!!errors.cpf} />
                {errors.cpf && <span className="text-xs text-red-500">{errors.cpf.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp (Com DDD)</label>
                <Input {...register("whatsapp")} placeholder="(11) 99999-9999" error={!!errors.whatsapp} />
                {errors.whatsapp && <span className="text-xs text-red-500">{errors.whatsapp.message}</span>}
                <p className="text-xs text-slate-500">Enviaremos a certidão PDF neste número.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input {...register("email")} placeholder="seu@email.com" error={!!errors.email} />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>
            </div>
          </div>
        </div>

        <div>
           <Card className="bg-slate-50 border-slate-200 sticky top-4">
             <CardHeader className="pb-4">
               <CardTitle className="text-lg flex items-center gap-2">
                 <FileText className="h-5 w-5 text-slate-500" />
                 Resumo do Pedido
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="text-sm space-y-3 pb-4 border-b border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipo:</span>
                    <span className="font-medium text-slate-900 text-right">
                      {data.tipoCertidao === 'inteiro-teor' ? 'Inteiro Teor' : 
                       data.tipoCertidao === 'onus' ? 'Ônus Reais' : 'Ações Reais'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cartório:</span>
                    <span className="font-medium text-slate-900 text-right max-w-50 truncate" title={data.cartorioId}>
                      {data.cartorioId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Local:</span>
                    <span className="font-medium text-slate-900 text-right">{data.cidade} - {data.uf}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Matrícula:</span>
                    <span className="font-medium text-slate-900 text-right">{data.matricula}</span>
                  </div>
               </div>

               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-600">Emolumentos + Taxas:</span>
                   <span>R$ {PRECO_CERTIDAO.toFixed(2).replace('.', ',')}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-600">Serviço Digital:</span>
                   <span>R$ {TAXA_SERVICO.toFixed(2).replace('.', ',')}</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                   <span>Total:</span>
                   <span>R$ {TOTAL.toFixed(2).replace('.', ',')}</span>
                 </div>
               </div>

               <Button 
                 type="submit" 
                 size="lg" 
                 className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg mt-4 h-14 shadow-md"
                 isLoading={isSubmitting}
               >
                 <ShieldCheck className="mr-2 h-5 w-5" />
                 Pagar com PIX
               </Button>
               
               <p className="text-xs text-center text-slate-400 mt-2">
                 Ambiente seguro. Seus dados estão protegidos.
               </p>
             </CardContent>
           </Card>
        </div>

      </form>
    </div>
  );
}