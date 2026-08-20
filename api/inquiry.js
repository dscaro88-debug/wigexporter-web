const allowedOrigins = new Set([
  'https://wigexporter.com',
  'https://www.wigexporter.com'
]);

const formLabels = {
  project_brief: 'Project brief',
  contact_rfq: 'Contact / RFQ',
  trade_account: 'Trade account application',
  colour_kit: 'Free colour kit request'
};

function clean(value, maxLength = 2000) {
  return String(value ?? '').replace(/\0/g, '').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const origin = clean(request.headers.origin, 300);
  const isPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
  if (origin && !allowedOrigins.has(origin) && !isPreview) {
    return response.status(403).json({ ok: false, error: 'Origin not allowed.' });
  }

  const body = request.body && typeof request.body === 'object' ? request.body : {};
  if (clean(body.website, 200)) {
    return response.status(200).json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const formType = clean(body.form_type, 60);
  if (!name || !isEmail(email) || !formLabels[formType]) {
    return response.status(400).json({ ok: false, error: 'Please provide a valid name, email and enquiry type.' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.INQUIRY_TO_EMAIL || 'caro@wigexporter.com';
  const sender = process.env.INQUIRY_FROM_EMAIL || 'WigExporter Website <website@wigexporter.com>';
  if (!resendApiKey) {
    return response.status(503).json({ ok: false, error: 'Enquiry delivery is temporarily unavailable.' });
  }

  const excluded = new Set(['website', 'form_type']);
  const details = Object.entries(body)
    .filter(([key, value]) => !excluded.has(key) && clean(value))
    .map(([key, value]) => [clean(key.replaceAll('_', ' '), 80), clean(value)]);

  const subject = `[WigExporter] ${formLabels[formType]} — ${name}`;
  const text = [
    formLabels[formType],
    '',
    ...details.map(([key, value]) => `${key}: ${value}`),
    '',
    `Page: ${clean(body.page_url, 500) || origin || 'Unknown'}`,
    `Received: ${new Date().toISOString()}`
  ].join('\n');

  const rows = details
    .map(([key, value]) => `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;border-bottom:1px solid #ddd">${escapeHtml(key)}</th><td style="padding:8px 12px;white-space:pre-wrap;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`)
    .join('');

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: email,
      subject,
      text,
      html: `<h1 style="font:600 24px Arial,sans-serif">${escapeHtml(formLabels[formType])}</h1><table style="border-collapse:collapse;font:14px Arial,sans-serif">${rows}</table>`
    })
  });

  if (!resendResponse.ok) {
    let providerMessage = '';
    try {
      const providerError = await resendResponse.json();
      providerMessage = providerError?.message || providerError?.error || JSON.stringify(providerError);
    } catch {
      providerMessage = await resendResponse.text().catch(() => '');
    }
    console.error('Inquiry email provider error', resendResponse.status, providerMessage);
    const userMessage = resendResponse.status === 401 || resendResponse.status === 403
      ? 'Email delivery is not configured. Please ask the site administrator to add a Resend API key in Vercel.'
      : 'We could not send your enquiry. Please email caro@wigexporter.com or contact us on WhatsApp.';
    return response.status(502).json({ ok: false, error: userMessage, providerMessage });
  }

  // —— 转发到 agent-intake：自动建档 + LLM 起草回信（不阻塞主流程）——
  const agentUrl = process.env.AGENT_INTAKE_URL || 'https://agent-intake-theta.vercel.app/api/intake';
  const agentSecret = process.env.AGENT_WEBHOOK_SECRET || 'agent-intake-2026';
  const agentRaw = [
    `Form: ${formLabels[formType]}`,
    ...details.map(([key, value]) => `${key}: ${value}`),
    `Page: ${clean(body.page_url, 500) || origin || 'Unknown'}`
  ].join('\n');
  fetch(agentUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': agentSecret },
    body: JSON.stringify({ project: 'wigexporter', channel: formType, raw_text: agentRaw })
  }).catch((err) => console.error('Agent forward failed', err));

  return response.status(200).json({ ok: true });
}
