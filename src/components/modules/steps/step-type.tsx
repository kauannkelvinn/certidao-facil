"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOrder } from "@/contexts/order-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, SearchX, Scale } from "lucide-react";

const formSchema = z.object({
  tipoCertidao: z.string().min(1, "Selecione o tipo de certidão"),
});

type FormData = z.infer<typeof formSchema>;

const TIPOS_CERTIDAO = [
  {
    id: "inteiro-teor",
    titulo: "Inteiro Teor (Matrícula)",
    descricao: "Cópia completa do registro do imóvel. Mostra o histórico de proprietários e situação atual.",
    icon: FileText,
  },
  {
    id: "onus",
    titulo: "Certidão de Ônus Reais",
    descricao: "Comprova se o imóvel tem dívidas, hipotecas, penhoras ou outros impedimentos.",
    icon: SearchX,
  },
  {
    id: "acoes",
    titulo: "Certidão de Ações Reais",
    descricao: "Verifica se existem processos judiciais envolvendo o imóvel.",
    icon: Scale,
  }
];

export function StepType() {
  const { data, updateData, nextStep } = useOrder();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoCertidao: data.tipoCertidao,
    },
  });

  const { handleSubmit, control, setValue, formState: { errors } } = form;
  
  const selectedType = useWatch({ control, name: "tipoCertidao" });

  function onSubmit(formData: FormData) {
    updateData(formData);
    nextStep();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="grid md:grid-cols-1 gap-4">
        {TIPOS_CERTIDAO.map((tipo) => (
          <div
            key={tipo.id}
            onClick={() => setValue("tipoCertidao", tipo.id)}
            className={cn(
              "relative flex items-start p-4 md:p-6 border-2 rounded-xl cursor-pointer transition-all hover:bg-slate-50",
              selectedType === tipo.id 
                ? "border-orange-600 bg-orange-50 ring-1 ring-orange-600" 
                : "border-slate-200"
            )}
          >
            <div className={cn(
              "p-3 rounded-full mr-4",
              selectedType === tipo.id ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"
            )}>
              <tipo.icon className="h-6 w-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className={cn("font-bold text-lg", selectedType === tipo.id ? "text-orange-900" : "text-slate-900")}>
                {tipo.titulo}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {tipo.descricao}
              </p>
            </div>

            <input
              type="radio"
              value={tipo.id}
              className="hidden" 
              {...form.register("tipoCertidao")}
            />
          </div>
        ))}
      </div>
      
      {errors.tipoCertidao && (
        <p className="text-red-500 text-sm font-medium text-center">
          {errors.tipoCertidao.message}
        </p>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" className="w-full md:w-auto">
          Continuar
        </Button>
      </div>
    </form>
  );
}