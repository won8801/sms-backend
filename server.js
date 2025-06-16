import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/send-sms', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: '수신 번호와 메시지를 입력하세요.' });
  }

  const payload = {
    appkey: process.env.APP_KEY,
    appsecret: process.env.APP_SECRET,
    appcode: process.env.APP_CODE,
    to,
    message
  };

  try {
    const response = await fetch(process.env.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    res.status(response.ok ? 200 : response.status).json(result);
  } catch (err) {
    res.status(500).json({ error: '서버 통신 오류', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`?? SMS 백엔드 서버 실행 중: http://localhost:${PORT}`);
});
