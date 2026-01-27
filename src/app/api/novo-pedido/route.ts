import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    await sheet.addRow({
        Data: dataAtual,
        Nome: body.dadosPessoais.nome,
        CPF: body.dadosPessoais.cpf,
        Whatsapp: body.dadosPessoais.whatsapp,
        Email: body.dadosPessoais.email,
        Tipo: body.tipoCertidao,
        Estado: body.uf,
        Cidade: body.cidade,
        Cartorio: body.cartorioId,
        Matricula: body.matricula,
        Status: "Aguardando Pagamento",
        PixCopiaCola: body.pixResponse?.code || '',
        PixUrl: body.pixResponse?.qrCodeUrl || ''
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Erro na planilha" }, { status: 500 });
    }
}