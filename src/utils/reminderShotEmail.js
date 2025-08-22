// Fungsi escapeHtml digunakan untuk menghindari karakter spesial HTML agar tidak menyebabkan XSS
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Fungsi utama untuk generate email HTML reminder shot
function generateShotReminderEmail(items = [], opts = {}) {
  const { title = "Shot Reminder", bodyText, footerNote } = opts;

  const rows = (Array.isArray(items) ? items : [])
    .map((it, idx) => {
      const machine = escapeHtml(it?.machine ?? "-");
      const shotsArr = Array.isArray(it?.shot) ? it.shot : [];
      const shots = shotsArr.length
        ? shotsArr.map(s => `• ${escapeHtml(s)}`).join("<br>")
        : "<em style=\"color:#667085;\">(tidak ada shot)</em>";

      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #EAECF0;vertical-align:top;font:14px/20px Arial, Helvetica, sans-serif;color:#101828;">
            ${idx + 1}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #EAECF0;vertical-align:top;font:14px/20px Arial, Helvetica, sans-serif;color:#101828;">
            <strong>${machine}</strong>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #EAECF0;vertical-align:top;font:14px/20px Arial, Helvetica, sans-serif;color:#101828;">
            ${shots}
          </td>
        </tr>`;
    })
    .join("");

  const tableBody =
    rows ||
    `<tr>
      <td colspan="3" style="padding:24px 16px;text-align:center;font:14px/20px Arial, Helvetica, sans-serif;color:#667085;border-bottom:1px solid #EAECF0;">
        Tidak ada data reminder shot.
      </td>
    </tr>`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(title)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="margin:0;background:#F9FAFB;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #EAECF0;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;border-bottom:1px solid #EAECF0;background:#FFFFFF;">
                <div style="font:700 18px/24px Arial, Helvetica, sans-serif;color:#101828;">${escapeHtml(title)}</div>
                ${
                  bodyText
                    ? `<div style="margin-top:4px;font:12px/18px Arial, Helvetica, sans-serif;color:#667085;">${escapeHtml(bodyText)}</div>`
                    : ""
                }
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 8px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <thead>
                    <tr>
                      <th align="left" style="padding:12px 16px;background:#F2F4F7;border-bottom:1px solid #EAECF0;font:12px/16px Arial, Helvetica, sans-serif;color:#475467;">No</th>
                      <th align="left" style="padding:12px 16px;background:#F2F4F7;border-bottom:1px solid #EAECF0;font:12px/16px Arial, Helvetica, sans-serif;color:#475467;">Machine</th>
                      <th align="left" style="padding:12px 16px;background:#F2F4F7;border-bottom:1px solid #EAECF0;font:12px/16px Arial, Helvetica, sans-serif;color:#475467;">Kanagata Shot Process</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tableBody}
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;border-top:1px solid #EAECF0;background:#FFFFFF;">
                <div style="font:12px/18px Arial, Helvetica, sans-serif;color:#667085;">
                  ${footerNote
      ? escapeHtml(footerNote)
      : "Email ini dibuat otomatis. Mohon tidak membalas ke alamat ini."
    }
                </div>
              </td>
            </tr>
          </table>

          <div style="padding:12px;font:11px/16px Arial, Helvetica, sans-serif;color:#98A2B3;">
            © ${new Date().getFullYear()} – HRS IoT Stamping
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

module.exports = { generateShotReminderEmail };
