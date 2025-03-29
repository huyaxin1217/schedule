const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', dataRoutes);

app.listen(3000, () => {
    console.log('后端服务运行在 http://localhost:3000');
});
