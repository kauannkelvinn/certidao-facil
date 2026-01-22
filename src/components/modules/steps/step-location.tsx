"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOrder } from "@/contexts/order-context";
import { Button } from "@/components/ui/button";
import { ESTADOS, MOCK_CARTORIOS } from "@/data/locations";
import { MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  uf: z.string().min(2, "Selecione um estado"),
  cidade: z.string().min(2, "Digite ou selecione a cidade"),
  cartorioId: z.string().min(1, "Selecione o cartório"),
});

type FormData = z.infer<typeof formSchema>;

export function StepLocation() {
  const { data, updateData, nextStep } = useOrder();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uf: data.uf,
      cidade: data.cidade,
      cartorioId: data.cartorioId,
    },
  });

  const { register, handleSubmit, control, formState: { errors } } = form;
  
  const selectedCidade = useWatch({ control, name: "cidade" });
  const selectedCartorioId = useWatch({ control, name: "cartorioId" });


  const cidadeKey = selectedCidade 
    ? Object.keys(MOCK_CARTORIOS).find(key => key.toLowerCase() === selectedCidade.toLowerCase())
    : null;
    
  const cartoriosDisponiveis = cidadeKey ? MOCK_CARTORIOS[cidadeKey] : [];

  function onSubmit(formData: FormData) {
    updateData(formData);
    nextStep();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado (UF)</label>
          <select 
            {...register("uf")}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
          >
            <option value="">Selecione...</option>
            {ESTADOS.map((estado) => (
              <option key={estado.sigla} value={estado.sigla}>
                {estado.sigla} - {estado.nome}
              </option>
            ))}
          </select>
          {errors.uf && <span className="text-xs text-red-500">{errors.uf.message}</span>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cidade</label>
          <input
            {...register("cidade")}
            placeholder="Ex: Fortaleza, Maracanaú..."
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
          />
          {errors.cidade && <span className="text-xs text-red-500">{errors.cidade.message}</span>}
        </div>
      </div>

      {cartoriosDisponiveis.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Selecione o Cartório Encontrado:
          </h3>
          <div className="grid gap-3">
            {cartoriosDisponiveis.map((cartorio) => (
              <label 
                key={cartorio} 
                className={cn(
                  "flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50",
                  selectedCartorioId === cartorio 
                    ? "border-orange-600 bg-orange-50 ring-1 ring-orange-600" 
                    : "border-slate-200"
                )}
              >
                <input 
                  type="radio" 
                  value={cartorio} 
                  {...register("cartorioId")} 
                  className="hidden" 
                />
                <MapPin className={cn(
                  "h-5 w-5 mr-3",
                  selectedCartorioId === cartorio ? "text-orange-600" : "text-slate-400"
                )} />
                <span className="text-sm font-medium text-slate-900">{cartorio}</span>
              </label>
            ))}
          </div>
          {errors.cartorioId && <span className="text-xs text-red-500">{errors.cartorioId.message}</span>}
        </div>
      )}

      {selectedCidade && selectedCidade.length > 3 && cartoriosDisponiveis.length === 0 && (
        <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-md">
          <p>
            <strong>Dica de teste:</strong> Digite &quot;Fortaleza&quot; ou &quot;Maracanaú&quot; para ver os cartórios aparecerem. 
            (No futuro, isso virá da API real).
          </p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" className="w-full md:w-auto">
          Continuar
        </Button>
      </div>
    </form>
  );
}