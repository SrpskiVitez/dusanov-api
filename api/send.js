export default async function handler(req, res) {
  // CORS zaglavlja
  res.setHeader('Access-Control-Allow-Origin', 'https://srpskivitez.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Obrada preflight OPTIONS zahteva
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ ok: false, error: 'Missing address' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = '8209168661';
  const text = `🌟 Нови захтев за Душанов златник на дар:\n\n📥 Адреса: ${address}`;

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const telegramRes = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        chat_id: chatId,
        text: text
      })
    });

    const data = await telegramRes.json();

    if (!data.ok) {
      return res.status(500).json({ ok: false, error: data.description });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
