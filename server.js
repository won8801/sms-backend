// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS 허용 - 프론트 도메인만 열어줌
app.use(cors({
  origin: 'https://won8801.github.io', // 필요 시 '*' 로 바꿀 수 있음
}));

// ✅ POST 요청 데이터 읽기
app.use(express.json());

// ✅ 실제 문자 전송 API 엔드포인트
app.post('/api/send-sms', async (req, res) => {
  const { appkey, appsecret, appcode, to, message } = req.body;

  // 유효성 검사
  if (!appkey || !appsecret || !appcode || !to || !message) {
    return res.status(400).json({ status: 'fail', error: '필수값 누락' });
  }

  try {
    // ✅ 문자 전송 API 요청 (업체에서 제공한 HTTP API)
    const result = await axios.get('http://43.133.60.95:9090/sms/send/v1', {
      params: {
        appkey,
        appsecret,
        appcode,
        to,
        msg: message
      }
    });

    // 결과 반환
    res.json({ status: 'ok', data: result.data });

  } catch (error) {
    console.error("문자 전송 실패:", error.message);
    res.status(500).json({ status: 'fail', error: '문자 전송 실패' });
  }
});

// ✅ 상태 확인용 엔드포인트
app.get('/api/ping', (req, res) => {
  res.send("📡 서버는 정상 작동 중입니다.");
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중! http://localhost:${PORT}`);
});
