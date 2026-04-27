const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const {
    connectDB,
    closeDB,
    isDbConnected,
    getDbConnectionError
} = require('./connection');

app.use(cors());
app.use(express.json());


const serverPort = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        dbConnected: isDbConnected(),
        dbError: getDbConnectionError()
    });
});

app.use('/api/tasks', taskRoutes);

const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error('MongoDB not connected. API started without DB access.');
    }

    app.listen(serverPort, () => {
        console.log(`Server is running on port ${serverPort}`);
    });
};

process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeDB();
    process.exit(0);
});

startServer();