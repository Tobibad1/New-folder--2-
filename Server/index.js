const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors)
app.use(express.json());

const serverPort = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(201).json ({ message: 'Hello World!' });
});

app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
});