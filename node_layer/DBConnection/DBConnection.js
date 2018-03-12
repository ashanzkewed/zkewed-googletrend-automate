// var Connection = require('tedious').Connection;
//
// function dbConnection(){
//
//     var config = {
//         userName: 'ASHAN\DELL',
//         password: '',
//         server: 'ZKEWED_GTREND',
//         // If you are on Microsoft Azure, you need this:
//         options: {encrypt: true, database: 'ZKEWED_GTREND'}
//     };
//     var connection = new Connection(config);
//     connection.on('connect', function(err) {
//         // If no error, then good to proceed.
//         console.log("Connected");
//
//     });
//
// }
//
// module.exports.dbConnection = dbConnection;
// module.exports.connection = connection;