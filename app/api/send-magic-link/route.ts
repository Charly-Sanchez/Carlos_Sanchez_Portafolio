import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, sessionId, shortCode } = await request.json();

    if (!email || !sessionId || !shortCode) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const magicLink = `${baseUrl}/?session=${sessionId}`;

    // TODO: Integrar con servicio de email (SendGrid, Resend, etc.)
    // Por ahora, solo registramos en consola
    console.log('=== Magic Link Email ===');
    console.log('To:', email);
    console.log('Magic Link:', magicLink);
    console.log('Short Code:', shortCode);
    console.log('=======================');

    // Aquí puedes integrar con tu servicio de email preferido:
    // 
    // Ejemplo con Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Carlos Sánchez <noreply@tudominio.com>',
    //   to: email,
    //   subject: 'Tu enlace para continuar la conversación',
    //   html: `
    //     <h2>Continúa tu conversación</h2>
    //     <p>Haz clic en el siguiente enlace para continuar nuestra conversación desde cualquier dispositivo:</p>
    //     <a href="${magicLink}">${magicLink}</a>
    //     <p>O usa este código: <strong>${shortCode}</strong></p>
    //   `
    // });

    return NextResponse.json({
      success: true,
      message: 'Magic link enviado (actualmente solo en consola)',
    });
  } catch (error) {
    console.error('Error al enviar magic link:', error);
    return NextResponse.json(
      { error: 'Error al enviar el enlace' },
      { status: 500 }
    );
  }
}
