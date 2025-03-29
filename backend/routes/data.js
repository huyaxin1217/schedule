const express = require('express');
const router = express.Router();
const db = require('../db');

// 保存日程
router.post('/events/save', (req, res) => {
    const { userId, events } = req.body;
    db.query('REPLACE INTO events (user_id, data) VALUES (?, ?)', [userId, JSON.stringify(events)], (err) => {
        if (err) return res.status(500).send('保存失败');
        res.send('保存成功');
    });
});

// 获取日程
router.get('/events/:userId', (req, res) => {
    db.query('SELECT data FROM events WHERE user_id = ?', [req.params.userId], (err, results) => {
        if (err || results.length === 0) return res.json([]);
        res.json(JSON.parse(results[0].data));
    });
});
