import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;

  const envVars = Object.keys(process.env)
    .filter(k => k.includes('RESEND') || k.includes('MAIL') || k.includes('API'))
    .reduce((acc, key) => {
      acc[key] = process.env[key] ? `[SET - ${(process.env[key] || '').length} chars]` : '[NOT SET]';
      return acc;
    }, {} as Record<string, string>);

  return NextResponse.json({
    RESEND_API_KEY: resendKey ? `[SET - ${resendKey.length} chars]` : '[NOT SET]',
    RESEND_FROM: resendFrom ? `[SET - ${resendFrom.length} chars]` : '[NOT SET]',
    allEnvVars: envVars,
    timestamp: new Date().toISOString(),
  });
}
