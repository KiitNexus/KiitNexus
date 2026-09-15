const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true, // reuse SMTP connections instead of opening a fresh one per email
  maxConnections: 5,
  maxMessages: 100,
})

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
                <div style="margin-top:10px; padding:15px; background:#f5f5f5; border-radius:6px; white-space:pre-wrap;">
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
  }

  return transporter.sendMail(mailOptions)
}

async function sendRecruitmentConfirmation({
  name,
  email,
  whatsapp,
  semester,
  year,
  branch,
  domain,
  resume,
}) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: `Application Received — KIIT Nexus Recruitment`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Application Received</title>
        </head>
        <body style="margin:0; padding:0; background-color:#0f0b11; font-family: 'Courier New', Courier, monospace; color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f0b11;">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#161019; border: 3px solid #ff0055; margin: 0 auto; max-width: 600px;">
                  
                  <!-- HEADER WITH BACKGROUND IMAGE -->
                  <tr>
                    <td background="https://res.cloudinary.com/da9zvp0mu/image/upload/v1789420345/71841b60-dbbd-44dd-961e-1e124d85c81c.png" style="background-image: url('https://res.cloudinary.com/da9zvp0mu/image/upload/v1789420345/71841b60-dbbd-44dd-961e-1e124d85c81c.png'); background-size: cover; background-position: center; border-bottom: 3px solid #ff0055; padding: 40px 20px; text-align: center;">
                      
                      <!-- LOGOS -->
                      <div style="margin-bottom: 15px;">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/KIIT_logo.svg/500px-KIIT_logo.svg.png" alt="KIIT Logo" width="60" style="vertical-align: middle; margin-right: 15px;" />
                        <span style="color:#ffffff; font-size: 24px; vertical-align: middle; font-family: Arial, sans-serif;">|</span>
                        <img src="https://res.cloudinary.com/da9zvp0mu/image/upload/v1771705575/WhatsApp_Image_2026-02-22_at_1.46.53_AM-removebg-preview_rcftja.png" alt="KIIT Nexus Logo" width="60" style="vertical-align: middle; margin-left: 15px;" />
                      </div>

                      <h1 style="margin:0; font-size:32px; text-transform:uppercase; font-weight:900; color:#ffc20e; letter-spacing: 2px;">
                        KIIT NEXUS
                      </h1>
                      <p style="margin:10px 0 0; color:#ff0055; font-weight:bold; text-transform:uppercase; letter-spacing: 1px; font-size: 14px;">
                        Recruitment Drive '26
                      </p>
                    </td>
                  </tr>

                  <!-- BODY CONTENT -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color:#ffffff; margin-top:0; text-transform:uppercase; font-size: 20px;">
                        HEY <span style="color:#ffc20e;">${name.toUpperCase()}</span>,
                      </h2>
                      <p style="font-size:16px; color:#cccccc; line-height:1.6;">
                        Application received successfully! You applied for the <strong><span style="color:#ff0055;">${domain.toUpperCase()}</span></strong> domain. Get ready to enter the Nexus.
                      </p>

                      <!-- MISSION DETAILS -->
                      <div style="margin: 30px 0; padding: 20px; background-color: #000000; border-left: 4px solid #ffc20e;">
                        <h3 style="margin-top:0; margin-bottom:15px; color:#ff0055; font-size:16px; text-transform:uppercase; letter-spacing: 1px;">MISSION DETAILS</h3>
                        <p style="margin:10px 0 0; font-size:15px; color:#999999;">DATE: <strong style="color:#ffc20e;">26TH & 27TH SEPT</strong></p>
                        <p style="margin:10px 0 0; font-size:15px; color:#999999;">VENUE: <strong style="color:#ffc20e;">CAMPUS 25</strong></p>
                      </div>

                      <!-- PROFILE -->
                      <div style="margin: 30px 0;">
                        <h3 style="margin-bottom:15px; color:#ffffff; font-size:16px; font-weight:normal; text-transform:uppercase;">
                          YOUR PROFILE
                        </h3>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;">
                          <tr>
                            <td style="padding:15px 0; border-top:1px solid #333333; color:#999999; width:35%;">KIIT EMAIL</td>
                            <td style="padding:15px 0; border-top:1px solid #333333; color:#ffffff; font-weight:bold;">${email}</td>
                          </tr>
                          <tr>
                            <td style="padding:15px 0; border-top:1px solid #333333; color:#999999;">WHATSAPP</td>
                            <td style="padding:15px 0; border-top:1px solid #333333; color:#ffffff; font-weight:bold;">${whatsapp}</td>
                          </tr>
                          <tr>
                            <td style="padding:15px 0; border-top:1px solid #333333; color:#999999;">BRANCH</td>
                            <td style="padding:15px 0; border-top:1px solid #333333; color:#ffffff; font-weight:bold;">${branch.toUpperCase()}</td>
                          </tr>
                          <tr>
                            <td style="padding:15px 0; border-top:1px solid #333333; border-bottom:1px solid #333333; color:#999999;">SEM / YEAR</td>
                            <td style="padding:15px 0; border-top:1px solid #333333; border-bottom:1px solid #333333; color:#ffffff; font-weight:bold;">${semester.toUpperCase()} / ${year.toUpperCase()}</td>
                          </tr>
                        </table>
                      </div>

                      <!-- BUTTON -->
                      <div style="text-align: center; margin: 40px 0;">
                        <a href="https://kiitnexus.in" style="display: inline-block; background-color: #ffc20e; color: #000000; padding: 15px 30px; font-weight: bold; text-decoration: none; font-size: 16px; font-family: 'Courier New', Courier, monospace; letter-spacing: 1px;">
                          VISIT KIIT NEXUS &rarr;
                        </a>
                      </div>

                      <!-- FOOTER -->
                      <p style="font-size:12px; color:#555555; margin-top:30px; line-height:1.8; text-transform:uppercase;">
                        SYSTEM GENERATED MESSAGE.<br/>
                        SHOW UP AT THE VENUE ON TIME. IF YOU HAVE QUERIES, JUST REPLY TO THIS EMAIL.
                      </p>
                      <p style="font-size:16px; color:#ffc20e; margin-top:20px; font-weight:bold; text-transform:uppercase;">
                        KIIT NEXUS TEAM
                      </p>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }

  return transporter.sendMail(mailOptions)
}

module.exports = {
  sendContactEmail,
  sendRecruitmentConfirmation,
}
