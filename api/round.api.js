'use strict';
var U = require("./../util/util");
var CONS = require("./../util/const");
var Q = require('q');

module.exports = function (app, pool) {
    //create chanelId
    app.post('/api/rounds', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.body;
            console.log("body content: %j", req.body);
            con.query("insert into round(clubName,golfCourse,selectRound,date,time,userId,userName,dateCreated,dateModified)values(?,?,?,?,?,?,?,?,?)",
                [b.clubName, b.golfCourse, b.selectRound, b.date, b.time, b.userId, b.userName, CONS.getTime(), CONS.getTime()],
                function (err, result) {
                    var out;
                    if (!err) {
                        var id = result.insertId;
                        if (id > 0) {
                            out = CONS.getJson(200, "Round created Successfully", b);
                        }
                        else {
                            out = CONS.getJson(100, "There is a problem while create a round. Please contact system admin", b);
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("create round", err, "Internal server error", b);
                    }
                    con.release();
                    res.json(out);
                });
        });
    });


}



