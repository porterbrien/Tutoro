import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SES_SECRET_KEY || '',
  },
});

export const sendMFACode = async (email: string, code: string, name: string) => {
  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL || 'porterbrien@icloud.com',
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: 'Your TutoroHealth verification code',
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <!DOCTYPE html>
            <html>
              <body style="margin:0;padding:0;background:#fdfcfb;font-family:'DM Sans',sans-serif;">
                <div style="max-width:480px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;border:1px solid rgba(0,0,0,0.06);">
                  <div style="background:linear-gradient(135deg,#1a1a2e,#2d1b4e);padding:2rem 2.5rem;">
                    <h1 style="margin:0;font-family:Georgia,serif;font-size:1.6rem;font-weight:300;color:white;">
                      Tutoro<span style="color:#c97384;font-style:italic;">Health</span>
                    </h1>
                  </div>
                  <div style="padding:2.5rem;">
                    <p style="font-size:1rem;color:#1a1a2e;margin-bottom:0.5rem;">Hello, ${name}</p>
                    <p style="font-size:0.95rem;color:#6b7280;margin-bottom:2rem;line-height:1.6;">
                      Use the code below to complete your sign in. This code expires in <strong>10 minutes</strong>.
                    </p>
                    <div style="background:linear-gradient(135deg,rgba(201,115,132,0.06),rgba(115,201,184,0.06));border-radius:16px;padding:2rem;text-align:center;margin-bottom:2rem;border:1px solid rgba(201,115,132,0.1);">
                      <div style="font-family:monospace;font-size:2.8rem;font-weight:700;letter-spacing:0.5rem;color:#1a1a2e;">
                        ${code}
                      </div>
                    </div>
                    <p style="font-size:0.85rem;color:#6b7280;line-height:1.6;">
                      If you didn't request this code, you can safely ignore this email.
                    </p>
                  </div>
                  <div style="padding:1.5rem 2.5rem;border-top:1px solid rgba(0,0,0,0.05);text-align:center;">
                    <p style="font-size:0.8rem;color:#aaa;margin:0;">© 2026 TutoroHealth. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        },
      },
    },
  });

  await sesClient.send(command);
};