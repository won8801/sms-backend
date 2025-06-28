// server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// 요청 로그 찍기 (Postman 요청 확인용)
app.use((req, res, next) => {
  console.log(`[요청됨] ${req.method} ${req.url}`);
  next();
});

// 사용자 데이터 파일 경로
const DATA_FILE = './users.json';

// 사용자 목록 읽기
function readUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// 사용자 목록 저장
function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// ✅ 로그인 API
app.post('/api/login', (req, res) => {
  const { id, pw } = req.body;
  const users = readUsers();
  const user = users.find(u => u.id === id && u.pw === pw);
  if (!user) {
    return res.status(401).json({ message: "로그인 실패" });
  }
  res.json(user);
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중! http://localhost:${PORT}`);
});
