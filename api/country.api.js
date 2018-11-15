'use strict';
var U = require("./../util/util");
var CONS = require("./../util/const");

module.exports = function (app, pool) {

    //  lookup user by userId
    app.get('/api/countries', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select * from country",
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "country doesn't exist", "", rows);
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get country", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });
}


