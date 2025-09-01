import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { webhookUrl, headers, payload } = body;

    if (!webhookUrl || !payload) {
      return NextResponse.json({ error: 'Missing required parameters: webhookUrl or payload' }, { status: 400 });
    }

    console.log(`Proxying webhook request to: ${webhookUrl}`);
    console.log('Payload:', payload);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: headers || { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text().catch(() => ({}));
    }

    if (!response.ok) {
      console.error(`Webhook error: ${response.status} ${response.statusText}`);
      console.error('Error details:', responseData);

      return NextResponse.json(
        {
          error: `Webhook error: ${response.status} ${response.statusText}`,
          details: responseData,
          success: false,
        },
        { status: response.status },
      );
    }

    console.log('Webhook success:', responseData);
    return NextResponse.json({
      data: responseData,
      success: true,
    });
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return NextResponse.json(
      {
        error: 'Failed to proxy webhook request',
        details: (error as Error).message,
        success: false,
      },
      { status: 500 },
    );
  }
}
