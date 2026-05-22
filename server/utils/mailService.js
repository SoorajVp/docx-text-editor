import transporter from "../config/nodemailer.js";

const buildInvitationHtml = ({ senderName, documentName, permission, inviteUrl }) => {
    const permissionLabel = permission === "write" ? "edit" : "view";
    const permissionBadge = permission === "write"
        ? `<span style="background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">Can Edit</span>`
        : `<span style="background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">Can View</span>`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Document Invitation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f97316;width:36px;height:36px;border-radius:8px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:18px;font-weight:700;line-height:36px;">D</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="font-size:20px;font-weight:700;color:#111827;letter-spacing:-0.5px;">Documate</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

              <!-- Orange top bar -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f97316;height:4px;"></td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 40px;">

                <!-- Icon -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:56px;height:56px;background:#fff7ed;border-radius:50%;display:inline-block;text-align:center;line-height:56px;">
                      <span style="font-size:26px;">📄</span>
                    </div>
                  </td>
                </tr>

                <!-- Headline -->
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#111827;">
                      You've been invited
                    </h1>
                  </td>
                </tr>

                <!-- Sub-headline -->
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.6;">
                      <strong style="color:#374151;">${senderName}</strong> has shared a document with you on Documate.
                    </p>
                  </td>
                </tr>

                <!-- Document Card -->
                <tr>
                  <td style="padding-bottom:28px;">
                    <table width="100%" cellpadding="0" cellspacing="0"
                      style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;">
                      <tr>
                        <td style="vertical-align:middle;padding-right:12px;width:36px;">
                          <div style="width:36px;height:36px;background:#fff7ed;border-radius:6px;text-align:center;line-height:36px;">
                            <span style="font-size:18px;">📝</span>
                          </div>
                        </td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 4px 0;font-size:14px;font-weight:600;color:#111827;">${documentName}</p>
                          <p style="margin:0;font-size:12px;color:#9ca3af;">Shared document &nbsp;·&nbsp; ${permissionBadge}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${inviteUrl}" target="_blank"
                      style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;
                             font-size:15px;font-weight:600;padding:14px 36px;border-radius:8px;
                             letter-spacing:0.2px;">
                      View Invitation &rarr;
                    </a>
                  </td>
                </tr>

                <!-- Note -->
                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin:6px 0 0 0;">
                      <a href="${inviteUrl}" style="font-size:12px;color:#f97316;word-break:break-all;">${inviteUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #f3f4f6;padding:20px 40px;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                      You received this email because <strong>${senderName}</strong> invited you to collaborate on Documate.
                      If you didn't expect this, you can safely ignore it.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} Documate &nbsp;·&nbsp; All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const sendAccessRequestEmail = async ({ senderName, senderEmail, recipientEmail, documentName, accessId, permission }) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const inviteUrl = `${frontendUrl}/shared/${accessId}`;

    try {
        const info = await transporter.sendMail({
            from: `"Documate" <${process.env.NODEMAILER_EMAIL}>`,
            to: recipientEmail,
            subject: `${senderName} shared a document with you`,
            text: `${senderName} (${senderEmail}) has invited you to ${permission === "write" ? "edit" : "view"} "${documentName}" on Documate.\n\nOpen the document here: ${inviteUrl}`,
            html: buildInvitationHtml({ senderName, documentName, permission, inviteUrl }),
        });

        console.log("Invitation email sent:", info.messageId);
    } catch (err) {
        console.error("Failed to send invitation email:", err);
        throw err;
    }
};

export default { sendAccessRequestEmail };
