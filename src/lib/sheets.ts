import { google } from 'googleapis';
import { ActionRecord } from '@/types';

/**
 * Vercel や .env に貼り付けられた秘密鍵の改行・クォーテーション文字を安全に正規化
 */
function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  let formatted = key.trim();
  // 先頭・末尾の引用符を削除
  if ((formatted.startsWith('"') && formatted.endsWith('"')) || (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1);
  }
  // \n 文字を実際の改行に置換
  return formatted.replace(/\\n/g, '\n');
}

/**
 * Google Sheets API クライアントの初期化
 */
export async function getGoogleSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const privateKey = formatPrivateKey(rawKey);
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID?.trim();

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.warn(
      '⚠️ Google Sheets API 認証情報が未設定です。ローカルデモモードで動作します。'
    );
    return null;
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return { sheets, spreadsheetId };
  } catch (error) {
    console.error('Failed to initialize Google Sheets Auth client:', error);
    return null;
  }
}

/**
 * ActionHistory シートにレコードを追記する
 */
export async function appendActionToSheet(record: ActionRecord): Promise<boolean> {
  try {
    const client = await getGoogleSheetsClient();
    if (!client) {
      return false;
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
        record.totalPoints !== undefined ? record.totalPoints : '',
      ],
    ];

    // まず ActionHistory シート名で試行、失敗した場合は最初のシート（A:G）へ書込
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'ActionHistory!A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });
    } catch {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to append record to Google Sheets:', error);
    return false;
  }
}

/**
 * ユーザーの ActionHistory から累積記録を取得する
 */
export async function fetchUserActionsFromSheet(userEmail: string): Promise<ActionRecord[]> {
  try {
    const client = await getGoogleSheetsClient();
    if (!client) return [];

    const { sheets, spreadsheetId } = client;

    let response;
    try {
      response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'ActionHistory!A:G',
      });
    } catch {
      response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A:G',
      });
    }

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return []; // ヘッダーのみまたは空

    // 1行目はヘッダー
    const targetQuery = (userEmail || '').trim().toLowerCase().replace(/\s+/g, '');
    const userRecords: ActionRecord[] = [];
    for (let i = 1; i < rows.length; i++) {
      const [timestamp, email, userName, actionType, questionDetail, pointsEarned, totalPoints] = rows[i];
      const rowEmail = (email || '').trim().toLowerCase().replace(/\s+/g, '');
      const rowName = (userName || '').trim().toLowerCase().replace(/\s+/g, '');

      // B列 (UserEmail) または C列 (UserName) のどちらに一致しても連動して過去履歴を取り出す
      if ((rowEmail && rowEmail === targetQuery) || (rowName && rowName === targetQuery)) {
        userRecords.push({
          id: `sheet-${i}`,
          timestamp: timestamp || new Date().toISOString(),
          userEmail: email,
          userName: userName || '',
          actionType: actionType as ActionRecord['actionType'],
          questionDetail: questionDetail || '',
          pointsEarned: Number(pointsEarned) || 0,
          totalPoints: totalPoints !== undefined ? Number(totalPoints) : undefined,
        });
      }
    }

    return userRecords;
  } catch (error) {
    console.error('Failed to fetch user actions from Google Sheets:', error);
    return [];
  }
}
