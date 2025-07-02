
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

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

app.get('/history', (req, res) => {
    const logPath = path.join(__dirname, 'sms_log.json');
    if (!fs.existsSync(logPath)) {
        return res.json([]);
    }
    const logs = JSON.parse(fs.readFileSync(logPath));
    res.json(logs);
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
