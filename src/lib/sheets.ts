import { google } from 'googleapis';
import { ActionRecord } from '@/types';

/**
 * Google Sheets API クライアントの初期化
 * .env.local に認証情報が設定されている場合に接続します。
 * 未設定の場合は、画面動作確認用のフォールバック（モック）を提供します。
 */
export async function getGoogleSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.warn(
      '⚠️ Google Sheets API 認証情報が .env.local に未設定です。ローカルデモモードで動作します。'
    );
    return null;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, spreadsheetId };
}

/**
 * ActionHistory シートにレコードを追記する
 */
export async function appendActionToSheet(record: ActionRecord): Promise<boolean> {
  try {
    const client = await getGoogleSheetsClient();
    if (!client) {
      // 認証情報がなければシミュレーション（成功扱い）
      return true;
    }

    const { sheets, spreadsheetId } = client;

    const values = [
      [
        record.timestamp,
        record.userEmail,
        record.userName,
        record.actionType,
        record.questionDetail,
        record.pointsEarned,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'ActionHistory!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to append record to Google Sheets:', error);
    return false;
  }
}

/**
 * ユーザーのActionHistoryから累積記録を取得する
 */
export async function fetchUserActionsFromSheet(userEmail: string): Promise<ActionRecord[]> {
  try {
    const client = await getGoogleSheetsClient();
    if (!client) return [];

    const { sheets, spreadsheetId } = client;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'ActionHistory!A:F',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return []; // ヘッダーのみまたは空

    // 1行目はヘッダー
    const targetEmail = (userEmail || '').trim().toLowerCase();
    const userRecords: ActionRecord[] = [];
    for (let i = 1; i < rows.length; i++) {
      const [timestamp, email, userName, actionType, questionDetail, pointsEarned] = rows[i];
      const rowEmail = (email || '').trim().toLowerCase();
      if (rowEmail === targetEmail) {
        userRecords.push({
          id: `sheet-${i}`,
          timestamp: timestamp || new Date().toISOString(),
          userEmail: email,
          userName: userName || '',
          actionType: actionType as ActionRecord['actionType'],
          questionDetail: questionDetail || '',
          pointsEarned: Number(pointsEarned) || 0,
        });
      }
    }

    return userRecords;
  } catch (error) {
    console.error('Failed to fetch user actions from Google Sheets:', error);
    return [];
  }
}
