// Lokalna baza danych
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "me",
    password: "secret",
    database: "my_db"


});
con.connect();
con.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

/*
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE mydb", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
});

*/