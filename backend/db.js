const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '你的数据库密码',
    database: 'schedule_app',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('已连接到 MySQL 数据库');
});

module.exports = connection;
