const express = require('express');
const router = express.Router();
const db = require('../db');

// 注册
router.post('/register', (req, res) => {
    const { username, password, nickname } = req.body;
    db.query(
        'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)',
        [username, password, nickname],
        (err) => {
            if (err) return res.status(500).send('注册失败');
            res.send('注册成功');
        }
    );
});

// 登录
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err || results.length === 0) return res.status(401).send('登录失败');
            res.send(results[0]); // 返回用户数据
        }
    );
});

module.exports = router;
