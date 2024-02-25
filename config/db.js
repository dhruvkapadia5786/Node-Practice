require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
	console.log('DB connected successfully...');
});

module.exports = mongoose;
