export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const GAME_URL = 'https://final-level.vercel.app';

  const { message } = req.body;
  if (!message) return res.status(200).json({ ok: true });

  const chatId = message.chat.id;
  const text = message.text || '';

  async function sendMessage(chatId, text, keyboard) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: keyboard || null
      })
    });
  }

  if (text === '/start') {
    await sendMessage(chatId,
      `🎮 <b>FINAL LEVEL</b> ga xush kelibsiz!\n\n` +
      `🏎️ <b>Level 1</b> — Avtopoyga\n` +
      `🐍🏓🚀 <b>Level 2</b> — Ilon | Ping-pong | Raketa\n` +
      `🌀 <b>Level 3</b> — Labirint\n\n` +
      `To'xtama. Davom et. Maqsadga yet! 💪`,
      {
        inline_keyboard: [[
          {
            text: '🎮 O\'yinni boshlash',
            web_app: { url: GAME_URL }
          }
        ]]
      }
    );
  } else {
    await sendMessage(chatId,
      '🎮 O\'yinni boshlash uchun /start yozing!',
      {
        inline_keyboard: [[
          {
            text: '🎮 O\'yinni boshlash',
            web_app: { url: GAME_URL }
          }
        ]]
      }
    );
  }

  return res.status(200).json({ ok: true });
}
