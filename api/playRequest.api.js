'use strict';
var U = require("./../util/util");
var CONS = require("./../util/const");
var Q = require('q');

module.exports = function (app, pool) {
    /**
          * @api {post} /api/playrequests Create new playRequest
          * @apiDescription Create new playRequest
          * @apiName Create new playRequest
          * @apiGroup Play Request
          * @apiParam {string} noOfHoles (In body)
          * @apiParam {string} day (In body)
          * @apiParam {string} venue (In body)
          * @apiParam {string} teeOffTime (In body)
          * @apiParam {string} type (In body)
          * @apiParam {string} requestInfo (In body)
          * @apiParam {string} redefineRequest (In body)
          * @apiParam {string} handicap (In body)
          * @apiParam {string} locations (In body)
          * @apiParam {string} industry (In body)
          * @apiParam {string} profession (In body)
          * @apiParam {string} gender (In body)
          * @apiParam {string} age (In body)
          * @apiParam {string} userId (In body)
          * @apiParam {string} userName (In body)
          * @apiParam {string} userImgUrl (In body)
          * @apiParam {string} players (In body)
         */
    app.post('/api/playrequests', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.body;
            var out;
            var registrationIds = [];
            var userIds1 = [];
            var savePlayReqest = function () {
                var deferred = Q.defer();
                con.query("insert into playRequest(noOfHoles,day,golfClub,teeOffTime,type,requestInfo,redefineRequest,handicap,locations,industry,profession,gender,age,userId,userName,userImgUrl,dateCreated,dateModified,players,NoOfHandicaps,affiliated,requestType)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [b.noOfHoles, b.day, b.venue, b.teeOffTime, b.type, b.requestInfo, b.redefineRequest, b.handicap, b.locations, b.industry, b.profession, b.gender, b.age, b.userId, b.userName, b.userImgUrl, CONS.getTime(), CONS.getTime(), b.players, b.NoOfHandicaps, b.affiliated, b.requestType],
                    function (err, result) {
                        if (!err) {
                            var id = result.insertId;
                            b.requestId = id;
                            if (id > 0) {
                                out = CONS.getJson(200, "Play request created Successfully", b);
                                res.json(out);
                                deferred.resolve(out);
                            }
                            else {
                                out = CONS.getJson(100, "There is a problem while create a play request. Please contact system admin", b);
                                res.json(out);
                                deferred.reject(out);
                            }
                        }
                        else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            res.json(out);
                            U.logError("create play request", err, "Internal server error", b);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var getUserIds = function () {
                var deferred = Q.defer();
                con.query('select userId from user',
                    function (err, rows) {
                        if (!err) {
                            if (rows.length == 0) {
                                out = CONS.getJson(100, 'No users found');
                                deferred.reject(out);
                            } else {
                                for (var i = 0; i < rows.length; i++) {
                                    userIds1.push(rows[i].userId);
                                }
                                console.log("final userid method first:-", userIds1);
                                deferred.resolve(rows);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            res.json(out);
                            U.logError("create play request", err, "Internal server error", b);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var playRequestAll = function (rows) {
                var deferred = Q.defer();
                var value = [];

                for (var i = 0; i < rows.length; i++) {
                    value.push([rows[i].userId, b.requestId, CONS.getTime(), 'pending']);
                }
                var sql = 'insert into playRequst_users(userId,playRequestId,createdDate,status)values ?';
                con.query(sql, [value],
                    function (err, rows) {
                        if (!err) {
                            out = CONS.getJson(200, "Play request created Successfully", b);
                            deferred.resolve(out);
                        } else {
                            console.log('error', err);
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            res.json(out);
                            U.logError("create play request", err, "Internal server error", b);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var playRequestInvite = function () {
                var deferred = Q.defer();
                var reciver = b.recieverIds.split("|");
                for (var i = 0; i < reciver.length; i++) {
                    userIds1.push(reciver[i]);
                }
                var value = [];
                for (var i = 0; i < reciver.length; i++) {
                    value.push([reciver[i], b.requestId, CONS.getTime(), 'pending']);
                }
                var sql = 'insert into playRequst_users(userId,playRequestId,createdDate,status)values ?';
                con.query(sql, [value],
                    function (err, rows) {
                        if (!err) {
                            out = CONS.getJson(200, "Play request created Successfully", b);
                            deferred.resolve(out);
                        } else {
                            console.log('error', err);
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            res.json(out);
                            U.logError("create play request", err, "Internal server error", b);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var getDeviceDetails = function () {
                var defer = Q.defer();
                var notification = {};
                var query = "select deviceId from device where userId in (" + userIds1 + ")";
                con.query(query, function (err, data) {
                    if (!err) {
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                registrationIds.push(data[i].deviceId);
                            }
                            notification.tag = 'playRequest';
                            notification.title = 'new play request recieved';
                            CONS.sendNotification(registrationIds, notification);
                        } else {
                            console.log("device id not found");
                        }
                        defer.resolve();
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        CONS.logError("get device ids", err, "Internal server error", b);
                        res.json(out);
                        defer.reject(out);
                    }
                })
                return defer.promise;
            };
            savePlayReqest()
                .then(function () {
                    if (b.requestType == 'Public Invite') {
                        return getUserIds()
                            .then(function (rows) {
                                return playRequestAll(rows);
                                // .then(function (out) {
                                //     con.release();
                                //     res.json(out);
                                // })
                            })
                    } else {
                        return playRequestInvite();
                        // .then(function (out) {
                        //     con.release();
                        //     res.json(out);
                        // })
                    }
                })
                .then(function () {

                    return getDeviceDetails();
                })
                .then(function () {
                    out = CONS.getJson(200, "Play request created Successfully", b);
                    con.release();
                    res.json(out);
                })
                .fail(function (out) {
                    con.release();
                    res.json(out);
                })
        });
    });

    /**
        * @api {post} /api/users/:id/upcomming/games Get all upcomming games
        * @apiDescription Get all upcomming games
        * @apiName Get all upcomming games
        * @apiGroup Play Request
        * @apiParam {string} id (In url) . Id is userId
    */
    app.post('/api/users/:id/upcomming/games', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.body;
            con.query('select * from playRequest where id IN (select requestId from requestJoinee where userId=? AND status="accept")ORDER BY day',
                [req.params.id],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "No upcomming game found");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get All upcomming games", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    // /**
    //    * @api {post} /api/send/playrequest Send play request
    //    * @apiDescription Send play request
    //    * @apiName Send play request
    //    * @apiGroup Play Request
    //    * @apiParam {string} requestId
    //    * @apiParam {string} userId
    //   */
    // app.post('/api/send/playrequest', function (req, res) {
    //     pool.getConnection(function (err, con) {
    //         var b = req.body;
    //         console.log("body content: %j", req.body);
    //         var sendPlayRequest = function () {
    //             var deferred = Q.defer();
    //             con.query("insert into requestJoinee(requestId,userId,status,dateCreated,dateModified)values(?,?,?,?,?)",
    //                 [b.requestId, b.userId, 'pending', CONS.getTime(), CONS.getTime()],
    //                 function (err, result) {
    //                     var out;
    //                     if (!err) {
    //                         var id = result.insertId;
    //                         if (id > 0) {
    //                             out = CONS.getJson(200, "Play request send Successfully");
    //                             deferred.resolve(out);
    //                         }
    //                         else {
    //                             out = CONS.getJson(100, "There is a problem while sending play request. Please contact system admin", b);
    //                             deferred.reject(out);
    //                         }
    //                     }
    //                     else {
    //                         out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
    //                         deferred.reject(out);
    //                     }
    //                 });
    //             return deferred.promise;
    //         };
    //         sendPlayRequest()
    //             .then(function (out) {
    //                 con.release();
    //                 res.json(out);
    //             })
    //             .fail(function (out) {
    //                 con.release();
    //                 res.json(out);
    //             })

    //     });
    // });

    //Join play request
    app.post('/api/join/playrequest', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.body;
            var out;
            var joinerDetails = function () {
                var deferred = Q.defer();
                var registrationids = [];
                var notification = {};
                con.query('select userId,profileImage,concat(firstName," ",lastName)as displayName from user where userId=?',
                    [b.userId],
                    function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                b.displayName = data[0].displayName;
                                b.profileImage = data[0].profileImage;
                                deferred.resolve();
                            } else {
                                out = CONS.getJson(100, "There is a problem while joining play request. Please contact system admin", b);
                                deferred.reject(out);
                            }
                        } else {
                            console.log(err);
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var savePlayReqest = function () {
                var deferred = Q.defer();
                con.query("insert into requestJoinee(requestId,userId,status,dateCreated,dateModified)values(?,?,?,?,?)",
                    [b.requestId, b.userId, 'pending', CONS.getTime(), CONS.getTime()],
                    function (err, result) {
                        var out;
                        if (!err) {
                            var id = result.insertId;
                            if (id > 0) {
                                out = CONS.getJson(200, "Play request send Successfully");
                                deferred.resolve(out);
                            }
                            else {
                                out = CONS.getJson(100, "There is a problem while sending play request. Please contact system admin", b);
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

            var notiFy = function () {
                var deferred = Q.defer();
                var registrationids = [];
                var notification = {};
                con.query('select userId,deviceId from device where userId IN (select userId from playRequest where id=?)',
                    [b.requestId],
                    function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                var status = 'open';
                                registrationids[0] = data[0].deviceId;
                                b.friendId = data[0].userId;
                                notification.tag = 'playRequest';
                                notification.title = b.displayName + ' ' + 'wants to join your play request';
                                CONS.sendNotification(registrationids, notification);
                                CONS.saveNotifecation(b.displayName, b.friendId, b.userId, b.profileImage, notification.title, notification.tag, notification.tag, 0, b.requestId, status);
                                deferred.resolve();
                            } else {
                                out = CONS.getJson(100, "There is a problem while joining play request. Please contact system admin", b);
                                deferred.reject(out);
                            }
                        } else {
                            console.log(err);
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            joinerDetails()
                .then(function () {
                    return savePlayReqest();
                })
                .then(function () {
                    return notiFy();
                })
                .then(function () {
                    out = CONS.getJson(200, "Play request join Successfully");
                    con.release();
                    res.json(out);
                })
                .fail(function (out) {
                    con.release();
                    res.json(out);
                })
        });
    });

    //update request status
    app.put('/api/requests', function (req, res) {
        var out;
        pool.getConnection(function (err, con) {
            var b = req.body;
            var statusUpdate = function () {
                var deferred = Q.defer();
                if (b.status == 'accept') {
                    con.query("update requestJoinee set status=? where userId=? AND requestId=?",
                        [b.status, b.userId, b.requestId], function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    out = CONS.getJson(200, "Play request accept successfully");
                                    deferred.resolve(out);
                                } else {
                                    out = CONS.getJson(100, "There is a problem when accept play request", b);
                                    deferred.reject(out);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                deferred.reject(out);
                            }
                        });
                } else if (b.status == 'cancel') {
                    con.query("update playRequst_users set status=? where userId=? AND requestId=?",
                        [b.status, b.userId, b.requestId], function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    out = CONS.getJson(200, "Play request cancel successfully");
                                    deferred.resolve(out);
                                } else {
                                    out = CONS.getJson(100, "There is a problem when blocking play request", b);
                                    deferred.reject(out);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                deferred.reject(out);
                            }
                        });
                }
                return deferred.promise;
            };
            var joinerDetails = function () {
                var deferred = Q.defer();
                var registrationids = [];
                var notification = {};
                con.query('select userId,profileImage,concat(firstName," ",lastName)as displayName from user where userId=(select userId from playRequest where id=?)',
                    [b.requestId],
                    function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                b.displayName = data[0].displayName;
                                b.profileImage = data[0].profileImage;
                                deferred.resolve();
                            } else {
                                out = CONS.getJson(100, "There is a problem while joining play request. Please contact system admin", b);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            }
            var notiFy = function (out) {
                var deferred = Q.defer();
                var registrationids = [];
                var notification = {};
                con.query('select deviceId from device where userId =?',
                    [b.userId],
                    function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                registrationids[0] = data[0].deviceId;
                                notification.tag = 'playRequest';
                                if (b.status == 'accept') {
                                    notification.title = b.displayName + ' ' + 'accept your play request';
                                    var status = 'close';
                                    CONS.saveNotifecation(b.displayName, b.userId, 0, b.userImgUrl, notification.title, notification.tag, null, null, b.requestId, status);
                                } else {
                                    notification.title = b.displayName + ' ' + 'reject your play request';
                                    var status = 'close';
                                    CONS.saveNotifecation(b.displayName, b.userId, b.friendId, b.userImgUrl, notification.title, notification.tag, null, null, b.requestId, status);
                                }
                                CONS.sendNotification(registrationids, notification);
                                deferred.resolve(out);
                            } else {
                                out = CONS.getJson(100, "There is a problem while joining play request. Please contact system admin", b);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            statusUpdate()
                .then(function () {
                    return joinerDetails();
                })
                .then(function () {
                    return notiFy(out);
                })
                .then(function (out) {
                    CONS.updateNotification(b.notificationId);
                    con.release();
                    res.json(out);
                })
                .fail(function (out) {
                    con.release();
                    res.json(out);
                })
        });
    });
    //get all friend who joined request
    app.get('/api/requests/:id/join', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select j.status,u.firstName,u.lastName,u.profileImage from user u left join playRequst_users j on u.userId=j.userId where j.playRequestId=? AND j.status='accept'",
                [req.params.id],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "User doesn't exist. Please check userId");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get request joinee by request id", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    //Get all memebrs who reject play request
    app.get('/api/users/:id/requests', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select j.status,u.firstName,u.lastName,u.profileImage from user u left join playRequst_users j on u.userId=j.userId where j.playRequestId in(select id from playRequest where userId=?) AND j.status='pending' or j.status='cancel'",
                [req.params.id],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "Not found");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get request joinee by request id", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    //GET ALL PLAY Request
    app.get('/api/playrequests/:userId', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select R.*, J.status from playRequest as R left join playRequst_users as J on R.id=J.playRequestId where J.userId=? ORDER BY R.id DESC",
                [req.params.userId],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "Play request not exist. Please check userId");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get request request", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    //GET ALL PLAY Request with filter
    app.post('/api/playrequests/filter/:userId', function (req, res) {
        pool.getConnection(function (err, con) {
            if (!err) {
                if (req.body.filterType == 'Handicap') {
                    var sql = 'select P.* ,J.status as userStatus from playRequest P left join  (select * from playRequst_users where userId=?)as J on J.playRequestId=P.id where NoOfHandicaps="' + req.body.filterValue + '" ORDER BY P.id DESC';
                } else if (req.body.filterType == 'Affiliated') {
                    var sql = 'select P.* ,J.status as userStatus from playRequest P left join  (select * from playRequst_users where userId=?)as J on J.playRequestId=P.id where affiliated="' + req.body.filterValue + '" ORDER BY P.id DESC';
                } else if (req.body.filterType == 'Region') {
                    var sql = 'select P.* ,J.status as userStatus from playRequest P left join  (select * from playRequst_users where userId=?)as J on J.playRequestId=P.id where locations="' + req.body.filterValue + '" ORDER BY P.id DESC';
                } else if (req.body.filterType == 'Golf course') {
                    var sql = 'select P.* ,J.status as userStatus from playRequest P left join  (select * from playRequst_users where userId=?)as J on J.playRequestId=P.id where golfClub="' + req.body.filterValue + '" ORDER BY P.id DESC';
                } else if (req.body.filterType == 'Industry') {
                    var sql = 'select P.* ,J.status as userStatus from playRequest P left join  (select * from playRequst_users where userId=?)as J on J.playRequestId=P.id where industry="' + req.body.filterValue + '" ORDER BY P.id DESC';
                } else if (req.body.filterType == 'Profession') {
                    var sql = 'select P.* ,J.status as userStatus from playRequest P left join  (select * from playRequst_users where userId=?)as J on J.playRequestId=P.id where profession="' + req.body.filterValue + '" ORDER BY P.id DESC';
                } else {
                    var sql = 'select P.* ,J.status as userStatus from playRequest P left join  (select * from playRequst_users where userId=?)as J on J.playRequestId=P.id  ORDER BY P.id DESC';
                }
                con.query(sql, [req.params.userId],
                    function (err, rows) {
                        var out;
                        if (!err) {
                            if (rows.length > 0)
                                out = CONS.getJson(200, "Success", rows);
                            else {
                                out = CONS.getJson(100, "Play request not exist.");
                            }
                        }
                        else {
                            console.log(err);
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            U.logError("get request request", err, "Internal server error. Please contact system admin", req.params);
                        }
                        con.release();
                        res.json(out)
                    });
            } else {
                console.log(err);
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get request request", err, "Internal server error. Please contact system admin", req.params);
            }
        });
    });

    //Serach play request
    app.get('/api/playrequests/:keyword', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.params.keyword;
            console.log(b);
            con.query("select * from playRequest where type like ? OR locations like ? OR venue like ? OR profession like ?",
                ['%' + req.params.keyword + '%', '%' + req.params.keyword + '%', '%' + req.params.keyword + '%', '%' + req.params.keyword + '%'],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "Play request not exist. Please check keyword");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        console.log(err);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    /**
        * @api {get} /api/playrquest/search  Search play request by userName
        * @apiDescription Search play request by userName
        * @apiName Search play request by userName
        * @apiGroup Play Request
        * @apiParam {string} text . text is query params 
       */
    app.get('/api/playrequest/search', function (req, res) {
        pool.getConnection(function (err, con) {
            if (req.query.text == 'undefind') {
                var sql = "select * from playRequest";
            } else {
                var sql = ('select * from playRequest where userName LIKE ?');
            }
            con.query(sql, ['%' + req.query.text + '%'],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "Not found");
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



