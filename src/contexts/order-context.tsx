"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface OrderData {
  uf: string;
  cidade: string;
  cartorioId: string;
  tipoCertidao: string;
  matricula: string;
  dadosPessoais: {
    nome: string;
    cpf: string;
    email: string;
    whatsapp: string;
  };
}

interface OrderContextType {
  step: number;
  data: OrderData;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (updates: Partial<OrderData>) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = "certidao-facil-order";

export function OrderProvider({ children }: { children: ReactNode }) {
  const initialData: OrderData = {
    uf: "",
    cidade: "",
    cartorioId: "",
    tipoCertidao: "",
    matricula: "",
    dadosPessoais: { nome: "", cpf: "", email: "", whatsapp: "" },
  };

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OrderData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // eslint-disable-next-line
        if (parsed.step) setStep(parsed.step);
        if (parsed.data) setData(parsed.data);
      } catch (e) {
        console.error("Erro ao recuperar pedido", e);
      }
    }
    setIsLoaded(true);
  }, []); 

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
    }
  }, [step, data, isLoaded]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  const updateData = (updates: Partial<OrderData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const clearOrder = () => {
    setData(initialData);
    setStep(1);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!isLoaded) return null; 

  return (
    <OrderContext.Provider value={{ step, data, nextStep, prevStep, updateData, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder deve ser usado dentro de um OrderProvider");
  }
  return context;
}