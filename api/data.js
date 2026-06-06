export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY
  };

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      // Ma'lumotlarni olish
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/oyinchilar?select=*`,
        { headers }
      );
      const data = await r.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      // Yangi oyinchi qo'shish
      const { nom, bosqich, vaqt, qadam, golib } = req.body;

      // Nom xavfsizligi
      if (!nom || nom.length < 3 || nom.length > 20 ||
          !/^[\w\u0400-\u04FF]+$/.test(nom)) {
        return res.status(400).json({ error: 'Noto\'g\'ri nom' });
      }

      // Avval bormi?
      const check = await fetch(
        `${SUPABASE_URL}/rest/v1/oyinchilar?nom=eq.${encodeURIComponent(nom)}&select=*`,
        { headers }
      );
      const mavjud = await check.json();

      if (mavjud.length > 0) {
        // Yangilash — faqat yaxshiroq natija
        if (bosqich >= mavjud[0].bosqich) {
          await fetch(
            `${SUPABASE_URL}/rest/v1/oyinchilar?nom=eq.${encodeURIComponent(nom)}`,
            { method: 'PATCH', headers, body: JSON.stringify({ bosqich, vaqt, qadam, golib }) }
          );
        }
      } else {
        // Yangi qo'shish
        await fetch(
          `${SUPABASE_URL}/rest/v1/oyinchilar`,
          {
            method: 'POST',
            headers: { ...headers, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ nom, bosqich, vaqt, qadam, golib: golib || false })
          }
        );
      }
      return res.status(200).json({ ok: true });
    }

  } catch (e) {
    return res.status(500).json({ error: 'Server xatosi' });
  }
}
