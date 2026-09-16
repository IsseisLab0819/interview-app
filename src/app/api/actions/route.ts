import { NextResponse } from 'next/server';
import { appendActionToSheet, fetchUserActionsFromSheet } from '@/lib/sheets';
import { ActionRecord } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, userName, actionType, questionDetail, pointsEarned, totalPoints } = body;

    if (!userEmail || !actionType || pointsEarned === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRecord: ActionRecord = {
      id: `action-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail,
      userName: userName || '生徒ユーザー',
      actionType,
      questionDetail: questionDetail || '',
      pointsEarned: Number(pointsEarned),
      totalPoints: totalPoints !== undefined ? Number(totalPoints) : undefined,
    };

    // Google Sheets へ追記（環境変数未設定時はスキップされる）
    const success = await appendActionToSheet(newRecord);

    return NextResponse.json({
      success,
      record: newRecord,
      message: 'Action recorded successfully',
    });
  } catch (error) {
    console.error('Error in actions POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const records = await fetchUserActionsFromSheet(email);
    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error in actions GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
