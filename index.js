const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'invader2025';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK VERIFICADO!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    
    if (message) {
      const from = message.from;
      const text = message.text?.body?.toLowerCase() || '';
      console.log(`Mensaje de ${from}: ${text}`);

      let reply = '';
      if (text.includes('menu')) {
        reply = `🍔 *INVADER - MENÚ*\n\n1️⃣ Hamburguesas\n2️⃣ Pizzas\n3️⃣ Papas\n4️⃣ Bebidas\n\nEscribí el número que querés ver.`;
      } else if (text.includes('1')) {
        reply = `🍔 *Hamburguesas Invader:*\n- Clásica\n- Doble Cheddar\n- Invader Especial`;
      } else {
        reply = `¡Hola! Soy el bot de Invader 👾\nEscribí *MENU* para ver la carta.`;
      }

      await axios.post(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply }
      }, {
        headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
      });
    }
    res.sendStatus(200);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.sendStatus(200);
  }
});

app.get('/', (req, res) => res.send('Invader Bot Activo'));
app.listen(process.env.PORT || 10000, () => console.log('Bot corriendo'));
