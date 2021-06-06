require('dotenv').config();

const mongoose = require('mongoose');

/**
 * DB 연결 (app.js에 위치 할 것)
 */
exports.connection = () => {
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function(){
        console.info('mongo conncted : ' + process.env.DB_URI);
    });
    mongoose.connect(process.env.DB_URI);
}