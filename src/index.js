const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {MONGODB_URI} = require('../config/keys');
//routes
const userRoutes = require('../src/routes/users');
const authenticationRoutes = require('../src/routes/authentication');
const orderRoutes = require('../src/routes/orders');

const {PORT, NODE_ENV} = require('../config/keys');
dotenv.config();

mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(value => {
    console.log(`Connected to database with name ${value.connection.db.databaseName}`);
}).catch(error => {
    console.log(`Error: ${error.message}`);
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/auth', authenticationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);

app.listen(PORT, () => {
    console.log(`Connected to server in ${NODE_ENV} mode on port ${PORT}`);
});
