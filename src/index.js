const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

//routes
const userRoutes = require('../src/routes/users');
const authenticationRoutes = require('../src/routes/authentication');
const orderRoutes = require('../src/routes/orders');

const {PORT, NODE_ENV} = require('../config/keys');
dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());

app.use('/api/v1/auth', authenticationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);

app.listen(PORT, () => {
    console.log(`Connected to server in ${NODE_ENV} mode on port ${PORT}`);
});
