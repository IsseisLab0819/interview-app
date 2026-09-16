import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  const envCheck = {
    hasClientEmail: !!clientEmail,
    clientEmailValue: clientEmail ? `${clientEmail.substring(0, 5)}...` : 'MISSING',
    hasPrivateKey: !!rawPrivateKey,
    privateKeyLength: rawPrivateKey ? rawPrivateKey.length : 0,
    hasSpreadsheetId: !!spreadsheetId,
    spreadsheetIdValue: spreadsheetId || 'MISSING',
  };

  if (!clientEmail || !rawPrivateKey || !spreadsheetId) {
    return NextResponse.json({
      status: 'ERROR',
      message: '環境変数が不足しています',
      envCheck,
    });
  }

  try {
    let formattedKey = rawPrivateKey.trim();
    if (
      (formattedKey.startsWith('"') && formattedKey.endsWith('"')) ||
      (formattedKey.startsWith("'") && formattedKey.endsWith("'"))
    ) {
      formattedKey = formattedKey.slice(1, -1);
    }
    formattedKey = formattedKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email: clientEmail.trim(),
      key: formattedKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // スプレッドシート情報の取得テスト
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId.trim(),
    });

    const sheetTitles = response.data.sheets?.map((s) => s.properties?.title) || [];

    // テスト書込（1行追記テスト）
    const testRecord = [
      new Date().toISOString(),
      'debug-test@school.ed.jp',
      '接続テストユーザー',
      '自己申告',
      'デバッグテスト完了',
      10,
      10,
    ];

    const targetSheet = sheetTitles.includes('ActionHistory') ? 'ActionHistory!A:G' : 'A:G';

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId.trim(),
      range: targetSheet,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [testRecord],
      },
    });

    return NextResponse.json({
      status: 'SUCCESS',
      message: '🎉 Google Sheets API への接続・書き込みテストに成功しました！',
      sheetTitles,
      targetSheetUsed: targetSheet,
      envCheck,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'Google Sheets API 接続エラー',
      errorMessage: error?.message || String(error),
      errorCode: error?.code,
      envCheck,
    });
  }
}
