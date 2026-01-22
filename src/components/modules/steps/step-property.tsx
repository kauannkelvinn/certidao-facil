"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOrder } from "@/contexts/order-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  matricula: z.string().min(1, "O número da matrícula é obrigatório"),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function StepProperty() {
  const { data, updateData, nextStep } = useOrder();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matricula: data.matricula,
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  function onSubmit(formData: FormData) {
    updateData({ matricula: formData.matricula });
    nextStep();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-100">
        Você selecionou: <strong>{data.tipoCertidao === 'inteiro-teor' ? 'Inteiro Teor' : 'Certidão'}</strong> <br/>
        No cartório de: <strong>{data.cidade} - {data.uf}</strong>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Número da Matrícula / Transcrição</label>
          <Input 
            {...register("matricula")} 
            placeholder="Ex: 12345" 
            className="text-lg py-6"
            error={!!errors.matricula}
          />
          {errors.matricula && <span className="text-xs text-red-500">{errors.matricula.message}</span>}
          <p className="text-xs text-slate-500">
            Geralmente encontrada no topo da escritura do imóvel.
          </p>
        </div>

        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700">Observações (Opcional)</label>
           <textarea 
             {...register("observacoes")}
             className="flex min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
             placeholder="Digite torre, apartamento ou detalhes adicionais se necessário..."
           />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" className="w-full md:w-auto">
          Ir para Pagamento
        </Button>
      </div>
    </form>
  );
}