"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
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
  cpf: z.string().min(14, "Documento inválido"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(14, "WhatsApp é obrigatório para entrega"),
});

type FormData = z.infer<typeof formSchema>;

export function StepCheckout() {
  const { data, nextStep, updateData } = useOrder();
  const { data: session } = useSession();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: data.dadosPessoais.nome,
      cpf: data.dadosPessoais.cpf,
      email: data.dadosPessoais.email,
      whatsapp: data.dadosPessoais.whatsapp,
    },
  });

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (session?.user?.email) {
      setValue("email", session.user.email);
    }
  }, [session, setValue]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }

    setValue("cpf", value, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    setValue("whatsapp", value, { shouldValidate: true });
  };

  async function onSubmit(formData: FormData) {
    try {
      const pixRes = await fetch('/api/criar-pix', { 
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({}) 
      });

      if (!pixRes.ok) throw new Error("Falha ao gerar PIX");
      const pixData = await pixRes.json();

      const pedidoComPix = { 
        ...data, 
        dadosPessoais: formData,
        pixResponse: {
            code: pixData.code,
            qrCodeUrl: pixData.qrCodeUrl
        }
      };

      await fetch('/api/novo-pedido', {
          method: 'POST',
          body: JSON.stringify(pedidoComPix)
      });

      updateData(pedidoComPix);
      nextStep(); 

    } catch (error) {
      console.error(error);
      alert("Erro ao processar. Tente novamente.");
    }
  }

  const PRECO_CERTIDAO = 59.90;
  const TAXA_SERVICO = 19.90;
  const TOTAL = PRECO_CERTIDAO + TAXA_SERVICO;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onChange: _cpfOnChange, ...cpfRegister } = register("cpf");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onChange: _whatsOnChange, ...whatsRegister } = register("whatsapp");

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
                <label className="text-sm font-medium">CPF ou CNPJ</label>
                <Input
                  {...cpfRegister}
                  placeholder="000.000.000-00"
                  maxLength={18}
                  onChange={handleCpfChange}
                  error={!!errors.cpf}
                />
                {errors.cpf && <span className="text-xs text-red-500">{errors.cpf.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp</label>
                <Input
                  {...whatsRegister}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  onChange={handlePhoneChange}
                  error={!!errors.whatsapp}
                />
                {errors.whatsapp && <span className="text-xs text-red-500">{errors.whatsapp.message}</span>}
                <p className="text-xs text-slate-500">Enviaremos a certidão PDF neste número.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input
                  {...register("email")}
                  placeholder="seu@email.com"
                  error={!!errors.email}
                  className={session?.user?.email ? "bg-slate-50 border-blue-200 text-blue-800 font-medium" : ""}
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                {session?.user?.email && (
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <User className="h-3 w-3" /> Preenchido via login Google
                  </p>
                )}
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