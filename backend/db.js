// backend/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'my_schedule_app'
});

module.exports = pool.promise();
