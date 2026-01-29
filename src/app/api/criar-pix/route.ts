import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 }
})

const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docNumber = body.dadosPessoais?.cpf?.replace(/\D/g, '') || '';
    const email = body.dadosPessoais?.email || 'email@padrao.com';


    const response = await payment.create({
      body: {
        transaction_amount: 79.90,
        description: 'Certidão Fácil - Emissão de Documento',
        payment_method_id: 'pix',
        payer: {
          email: email,
          identification: {
            type: docNumber.length > 11 ? 'CNPJ' : 'CPF',
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
      qrCodeUrl: transactionData.qr_code_base64,
      paymentId: response.id?.toString()
    });

  } catch (error) {
    console.error("Erro Mercado Pago:", error);
    return NextResponse.json({ error: "Erro ao processar pagamento no Mercado Pago" }, { status: 500 });
  }
}