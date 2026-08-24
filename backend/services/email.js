const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendContactEmail({ name, email, subject, message }) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_RECEIVER,
    replyTo: email,
    subject: `New Contact Form Submission — KIIT Nexus`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New Contact Form Submission</title>
        </head>

        <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">
          <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:10px; overflow:hidden;">

            <div style="padding:24px; background:#111111; color:#ffffff;">
              <h2 style="margin:0;">KIIT Nexus</h2>
              <p style="margin:8px 0 0;">New Contact Form Submission</p>
            </div>

            <div style="padding:24px;">

              <p><strong>Name:</strong> ${name}</p>

              <p><strong>Email:</strong> ${email}</p>

              <p><strong>Subject:</strong> ${subject}</p>

              <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>

              <div style="margin-top:20px;">
                <strong>Message:</strong>

                <div style="
                  margin-top:10px;
                  padding:15px;
                  background:#f5f5f5;
                  border-radius:6px;
                  white-space:pre-wrap;
                ">
                  ${message}
                </div>
              </div>

              <p style="margin-top:25px; color:#666;">
                This message was submitted through the KIIT Nexus website.
              </p>

            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendContactEmail,
};
