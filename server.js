const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;  // Render에서 기본 포트가 10000일 수 있음

app.use(cors());
app.use(bodyParser.json());

// 문자 발송 API (모의)
app.post('/send-sms', (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: 'Missing "to" or "message"' });
    }

    const logEntry = {
        to,
        message,
        timestamp: new Date().toISOString()
    };

    const logPath = path.join(__dirname, 'sms_log.json');
    const existingLogs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];

    existingLogs.push(logEntry);
    fs.writeFileSync(logPath, JSON.stringify(existingLogs, null, 2));

    res.json({ success: true, message: 'SMS logged (simulate sending)' });
});

// 문자 발송 이력 조회 API
app.get('/history', (req, res) => {
    const logPath = path.join(__dirname, 'sms_log.json');
    if (!fs.existsSync(logPath)) {
        return res.json([]);
    }
    const logs = JSON.parse(fs.readFileSync(logPath));
    res.json(logs);
});

// ✅ 루트 경로에 접속 시 안내 메시지
app.get('/', (req, res) => {
    res.send('📡 SMS 백엔드 서버가 정상 작동 중입니다.');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
