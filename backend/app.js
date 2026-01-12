const express = require('express');
const authRoutes = require('./routes/authroutes');
const taskRoutes = require('./routes/taskroutes');
const cors = require('cors')


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

module.exports = app;