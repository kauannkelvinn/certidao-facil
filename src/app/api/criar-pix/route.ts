import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN!, 
  options: { timeout: 5000 } 
});

const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docNumber = body.dadosPessoais?.cpf?.replace(/\D/g, '') || '';
    
    const email = body.dadosPessoais?.email || 'email_nao_informado@certidaofacil.com';
    
    const nomeCompleto = body.dadosPessoais?.nome || "Cliente";
    const partesNome = nomeCompleto.split(" ");
    const primeiroNome = partesNome[0];
    const sobrenome = partesNome.slice(1).join(" ") || " ";

    const docType = docNumber.length > 11 ? 'CNPJ' : 'CPF';

    console.log(`Criando PIX para: ${primeiroNome} (${email}) - CPF: ${docNumber}`);

    const response = await payment.create({
      body: {
        transaction_amount: 79.90, 
        description: 'Certidão Fácil - Emissão de Documento',
        payment_method_id: 'pix',
        payer: {
          email: email,
          first_name: primeiroNome,
          last_name: sobrenome,
          identification: {
            type: docType,
            number: docNumber
          }
        },
        date_of_expiration: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      }
    });

    const pointOfInteraction = response.point_of_interaction;
    const transactionData = pointOfInteraction?.transaction_data;

    if (!transactionData) {
      throw new Error("QR Code não gerado pelo Mercado Pago");
    }

    return NextResponse.json({
      code: transactionData.qr_code,
      qrCodeUrl: `data:image/png;base64,${transactionData.qr_code_base64}`,
      paymentId: response.id?.toString()
    });

  } catch (error) {
    console.error("Erro Mercado Pago:", error);
    return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 });
  }
}