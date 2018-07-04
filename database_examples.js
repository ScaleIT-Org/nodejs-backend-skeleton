function dbs() {
    //////////////////SQLITE///////////////////////////////////////////////////////////////////////////////////SQLITE3
    sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('./db/katzen.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the katzen database.');
    });


    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS katzen (info TEXT)");

        var stmt = db.prepare("INSERT INTO katzen VALUES (?)");
        stmt.run("SQLITEKatze");
        stmt.finalize();

        db.each("SELECT rowid AS id, info FROM katzen", function (err, row) {
            console.log(row.id + ": " + row.info);

        });

    });

    db.close();


    ///////////////MONGODB//////////////////////////////////////////////////////////////////////////////////////MONGODB

    var mongo = require('mongodb');
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.createCollection("mongokatzen", function (err, res) {
            if (err) throw err;
            console.log("Collection created!");
        });

        var myobj = [{name: "MongoJopa"}, {name: "MongoJopa2"}];
        dbo.collection("mongokatzen").insertMany(myobj, function (err, res) {
            if (err) throw err;
            db.close()
        });
        dbo.collection("mongokatzen").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);

        });
        db.close();
    });

    /////////////////MYSQL//////////////////////////////////////////////////////////////////////////////MYSQL

    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "123456789"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
            if (err) throw err;
            console.log("Database created");
        });
        con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "123456789",
            database: "mydb"
        });
        var sql = "CREATE TABLE IF NOT EXISTS mykatzen (name VARCHAR(255))";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created");
        });
        var sql = "INSERT INTO mykatzen (name) VALUES ?";
        var values = [
            ['MyJopa1'],
            ['MyJopa2'],
            ['MyJopa3']
        ];
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });

        con.query("SELECT * FROM mykatzen", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
}

module.exports = {
    dbs
}