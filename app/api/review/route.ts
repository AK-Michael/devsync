import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { reviewCode } from '@/lib/claude';
import { Language } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Review request body:', body);

    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
    }

    const review = await reviewCode(code, language as Language);
    console.log('Review result:', JSON.stringify(review));
    return NextResponse.json(review);

  } catch (error: any) {
    console.error('Review route error:', error?.message || error);
    return NextResponse.json(
      { error: 'AI review failed', details: error?.message },
      { status: 500 }
    );
  }
}
