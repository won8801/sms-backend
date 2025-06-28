// server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// 요청 로그
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 사용자 파일
const DATA_FILE = './users.json';

// 사용자 읽기/쓰기
function readUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// ✅ 로그인 API
app.post('/api/login', (req, res) => {
  const { id, pw } = req.body;
  const users = readUsers();
  const user = users.find(u => u.id === id && u.pw === pw);
  if (!user) return res.status(401).json({ message: "로그인 실패" });
  res.json(user);
});

// ✅ 문자 수신 저장 API
app.post('/api/sms', (req, res) => {
  const { sender, message, receivedAt } = req.body;

  if (!sender || !message || !receivedAt) {
    return res.status(400).json({ status: 'error', message: '필드 누락' });
  }

  const logLine = `[${receivedAt}] FROM: ${sender} - ${message}\n`;
  const logDir = path.join(__dirname, 'logs');
  const logFile = path.join(logDir, 'sms_log.txt');

  // logs 폴더 없으면 생성
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  fs.appendFileSync(logFile, logLine, 'utf8');
  console.log(`[SMS 저장됨] ${logLine.trim()}`);
  res.json({ status: 'ok' });
});

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중! http://localhost:${PORT}`);
});
