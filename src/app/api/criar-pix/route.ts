import { NextResponse } from 'next/server';

export async function POST(_request: Request) {
  try {
    // const body = await request.json();
    
    const apiKey = process.env.ABACATE_PAY_API_KEY;
    const url = "https://api.abacatepay.com/v1/pixQrCode/create";
    const payload = {
      amount: 7990, 
      expiresIn: 900
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Abacate:", data);
      throw new Error(data.message || "Erro ao gerar PIX");
    }

    return NextResponse.json({
      code: data.data.brCode,
      qrCodeUrl: data.data.brCodeBase64,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 });
  }
}