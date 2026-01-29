import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();

    const meusPedidos = rows
      .filter(row => row.get('Email')?.toLowerCase() === userEmail.toLowerCase())
      .map(row => ({
        id: row.rowNumber,
        data: row.get('Data'),
        nome: row.get('Nome'),
        cpf: row.get('CPF'),           
        whatsapp: row.get('Whatsapp'), 
        email: row.get('Email'),       
        uf: row.get('Estado'),         
        cidade: row.get('Cidade'),     
        cartorioId: row.get('Cartorio'),
        tipoCertidao: row.get('Tipo'),
        matricula: row.get('Matricula'), 
        status: row.get('Status') || "Aguardando",
        pixCopiaCola: row.get('PixCopiaCola'),
        pixUrl: row.get('PixUrl'),
      }))
      .reverse();

    return NextResponse.json(meusPedidos);

  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}