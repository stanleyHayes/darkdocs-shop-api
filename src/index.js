const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');

//routes
const userRoutes = require('../src/routes/users');
const authenticationRoutes = require('../src/routes/authentication');
const orderRoutes = require('../src/routes/orders');
const bankRoutes = require('../src/routes/banks');
const dumpsRoutes = require('../src/routes/dumps');
const fundsRoutes = require('../src/routes/funds');
const loginsRoutes = require('../src/routes/logins');
const instructionsRoute = require('../src/routes/instructions');
const chequeRoutes = require('../src/routes/cheques');
const informationRoute = require('../src/routes/information');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
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
app.use('/api/v1/instructions', instructionsRoute);
app.use('/api/v1/funds', fundsRoutes);
app.use('/api/v1/banks', bankRoutes);
app.use('/api/v1/logins', loginsRoutes);
app.use('/api/v1/dumps', dumpsRoutes);
app.use('/api/v1/cheques', chequeRoutes);
app.use('/api/v1/information', informationRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Connected to server in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
});
