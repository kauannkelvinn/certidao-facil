"use client";

import { OrderProvider, useOrder } from "@/contexts/order-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepType } from "@/components/modules/steps/step-type";
import { StepLocation } from "@/components/modules/steps/step-location";
import { StepProperty } from "@/components/modules/steps/step-property";
import { StepCheckout } from "@/components/modules/steps/step-checkout";
import { StepSuccess } from "@/components/modules/steps/step-success";

export default function PedidoPage() {
  return (
    <OrderProvider>
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <PedidoWizard />
      </div>
    </OrderProvider>
  );
}

function PedidoWizard() {
  const { step, prevStep } = useOrder();

  if (step === 5) {
    return <StepSuccess />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      <div className="flex justify-between items-center mb-8 px-2 md:px-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center relative">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 z-10 
              ${step >= i ? 'bg-orange-600 text-white scale-110 shadow-md' : 'bg-slate-200 text-slate-500'}`}
            >
              {i}
            </div>
            {i < 4 && (
              <div className={`absolute left-10 w-[calc(100vw/4-40px)] md:w-40 h-1 mx-2 transition-colors duration-500 ${step > i ? 'bg-orange-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl text-slate-800">
            {step === 1 && "Onde fica o imóvel?"}
            {step === 2 && "Qual certidão você precisa?"}
            {step === 3 && "Dados do Imóvel"}
            {step === 4 && "Identificação e Pagamento"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="min-h-50 py-4">
            {step === 1 && <StepLocation />}
            {step === 2 && <StepType />}
            {step === 3 && <StepProperty />}
            {step === 4 && <StepCheckout />}
          </div>

          {step > 1 && (
             <div className="flex justify-start mt-6 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={prevStep} type="button">
                  Voltar
                </Button>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}