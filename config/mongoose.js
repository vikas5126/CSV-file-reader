const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/CSVFile');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error in connect with database'));

db.once('open', function(){
    console.log('the connection is successful');
})

module.exports = db;