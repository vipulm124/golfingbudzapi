'use strict';
var U = require("./../util/util");
var CONS = require("./../util/const");
var Q = require('q');

module.exports = function (app, pool) {
    //create Group
    app.post('/api/pages', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.body;
            var createGroup = function () {
                var deferred = Q.defer();
                console.log("body content: %j", req.body);
                con.query("insert into page(title,description,image,video,userId,userName,dateModified,dateCreated)values(?,?,?,?,?,?,?,?)",
                    [b.title, b.description, b.image, b.video, b.userId, b.userName, CONS.getTime(), CONS.getTime()],
                    function (err, result) {
                        var out;
                        if (!err) {
                            var id = result.insertId;
                            b.groupId = id;
                            if (id > 0) {
                                out = CONS.getJson(200, "Group created Successfully", b);
                                deferred.resolve(out);
                            }
                            else {
                                out = CONS.getJson(100, "There is a problem while create a Group. Please contact system admin", b);
                                deferred.reject(out);
                            }
                        }
                        else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var groupInvite = function () {
                var deferred = Q.defer();
                var out;
                console.log("body content: %j", req.body);
                var result = b.friendId.split('|').map(Number);
                con.query("insert into groupMembers(userId,friendId,groupId,dateCreated,dateModified,status)values(?,?,?,?,?,?)",
                    [b.userId, b.friendId, b.groupId, CONS.getTime(), CONS.getTime(), 'add'],
                    function (err, result) {
                        if (!err) {
                            var id = result.insertId;
                            if (id > 0) {
                                deferred.resolve();
                            }
                            else {
                                out = CONS.getJson(100, "There is a problem while create a Group. Please contact system admin", b);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            createGroup()
                .then(function (b) {
                    return groupInvite(b);
                })
                .then(function (out) {
                    out = CONS.getJson(200, "Group created Successfully", b);
                    con.release();
                    res.json(out);
                })
                .fail(function (out) {
                    con.release();
                    res.json(out);
                })
        });
    });

    //Update page by pageId
    app.put('/api/pages', function (req, res) {
        var b = req.body;
        console.log("body from update :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {
            con.query('update page set title =?,description=?,category=?,operatingHours=?,image=?,video=?,dateModified=? where id=?',
                [b.title, b.description, b.category, b.operatingHours, b.image, b.video, CONS.getTime(), b.id],
                function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            out = CONS.getJson(200, "Page update successfully", b);
                        } else {
                            out = CONS.getJson(100, "There is a problem while updating page. Please contact system admin", b);
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                    }
                    con.release();
                    res.json(out);
                });
        });
    });

    //  lookup groups by userId
    app.get('/api/users/:id/groups', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select * from page where userId=?",
                [req.params.id],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "Group doesn't exist. Please check userId");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get group by id", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    //Like an event 
    // app.put('/api/events/:id/like', function (req, res) {
    //     var out = {};
    //     pool.getConnection(function (err, con) {
    //         con.query('update events set likes =likes + 1 where id=?',
    //             [req.params.id],
    //             function (err, result) {
    //                 if (!err) {
    //                     if (result.affectedRows > 0) {
    //                         out = CONS.getJson(200, "You liked this event");

    //                     } else {
    //                         out = CONS.getJson(100, "There is a problem while like event. Please contact system admin");
    //                     }
    //                 }
    //                 else {
    //                     out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);

    //                 }
    //                 con.release();
    //                 res.json(out);
    //             });
    //     });
    // });

    //Attend an event 
    app.post('/api/events/attend', function (req, res) {
        var b = req.body;
        var out = {};
        pool.getConnection(function (err, con) {
            con.query('insert into eventAttendees (eventId,userId,userName)values(?,?,?)',
                [b.eventId, b.userId, b.userName],
                function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            out = CONS.getJson(200, "You are going to attend this event");

                        } else {
                            out = CONS.getJson(100, "There is a problem while you attend this event. Please contact system admin");
                        }
                    }
                    else {
                        out = CONS.getJson("attend event", 300, "Internal server error. Please contact system admin", "", err);
                    }
                    con.release();
                    res.json(out);
                });
        });
    });

    app.post('/api/pages/invite', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.body;
            console.log("body content: %j", req.body);
            con.query("insert into pageInvite(title,description,category,operatingHours,image,video,userId,userName,dateModified,dateCreated)values(?,?,?,?,?,?,?,?,?,?)",
                [b.title, b.description, b.category, b.operatingHours, b.image, b.video, b.userId, b.userName, CONS.getTime(), CONS.getTime()],
                function (err, result) {
                    var out;
                    if (!err) {
                        var id = result.insertId;
                        if (id > 0) {
                            out = CONS.getJson(200, "Page created Successfully", b);
                        }
                        else {
                            out = CONS.getJson(100, "There is a problem while create a page. Please contact system admin", b);
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("create page", err, "Internal server error", b);
                    }
                    con.release();
                    res.json(out);
                });
        });
    });
}



