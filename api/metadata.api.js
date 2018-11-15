'use strict';
var U = require("./../util/util");
var CONS = require("./../util/const");

module.exports = function (app, pool) {

   
    app.get('/api/categories', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select * from categories",
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "catgories doesn't exist");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    app.get('/api/industry', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select * from industry",
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "industry doesn't exist");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

     app.get('/api/profession', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select * from profession",
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "profession doesn't exist");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    app.get('/api/region', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select * from regions",
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "regions doesn't exist");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });
}


