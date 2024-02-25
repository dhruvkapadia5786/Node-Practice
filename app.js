require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');



const app = express();

require('./config/passport-config');

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/users', userRoutes);
app.use('/files', fileRoutes);
app.use('/payment', paymentRoutes)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
