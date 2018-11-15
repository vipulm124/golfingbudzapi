'use strict';
var U = require("./../util/util");
var Q = require('q');
var Notification = require('./../model/notification.model');
var CONS = require("./../util/const");
var mongoose = require('mongoose');

module.exports = function (app, pool) {
    //  lookup user by user name
    app.get('/api/users/:userId/friends/:name/search', function (req, res) {
        console.log(req.params.name);
        pool.getConnection(function (err, con) {
            con.query("select distinct case when f.userId=? then f.userId else	0 end as refId,case when f.userId=? then f.status	else null end as 'status', k.* from (select  u.userId,u.firstName,u.lastName,u.email,u.profileImage,u.country,u.handicap,u.strength,u.weakness,u.auth_token,u.userType,u.clubName,u.description,u.address,u.city,u.subrub,u.operatingHours,u.contact from user u where u.firstName like ? AND userId !=?)as k left join friend f on k.userId=f.friendId",
                [req.params.userId, req.params.userId, '%' + req.params.name + '%', req.params.userId],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "User doesn't exist. Please check name", "", rows);
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get user by name", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    //Check friend channelId
    app.get('/api/channel/:userId/:friendId', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.params;
            con.query("select * from friend where userId=? AND friendId=?",
                [b.userId, b.friendId],
                function (err, result) {
                    var out;
                    if (!err) {
                        if (result.length > 0) {
                            b.chanelId = result[0].chanelId;
                            b.status = result[0].status;
                            out = CONS.getJson(200, "Already in your friend list", b);
                        } else {
                            out = CONS.getJson(100, "User not exists in your friend list");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get channelId", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out);
                });
        });
    });
    //get all friend list
    app.get('/api/users/:id/friends', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select distinct f.status,f.chanelId,u.userId,u.firstName,u.lastName,u.profileimage as profileImage,'1' as refId  from user u left join friend f on u.userId=f.friendId where f.userId = ?",
                [req.params.id],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "No friend found");
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get consumer by id", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });
    /**
          * @api {post} /api/friend/request Send friend request
          * @apiDescription Send friend request
          * @apiName Send friend request
          * @apiGroup FriendRequest
          * @apiParam {string} userId (In body)
          * @apiParam {string} friendId (In body)
         */
    app.post('/api/friend/request', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.body;
            console.log('data from api', b);
            var genrateChalengeId = function () {
                var deferred = Q.defer();
                b.chanelId = 'CH' + "-" + b.userId + "-" + b.friendId;
                con.query("insert into friend(userId,friendId,status,chanelId,dateCreated,dateModified)values(?,?,?,?,?,?)",
                    [b.userId, b.friendId, 'sent', b.chanelId, CONS.getTime(), CONS.getTime()],
                    function (err, result) {
                        var out;
                        if (!err) {
                            if (result.affectedRows == 1) {
                                con.query("insert into friend(userId,friendId,status,chanelId,dateCreated,dateModified)values(?,?,?,?,?,?)",
                                    [b.friendId, b.userId, 'pending', b.chanelId, CONS.getTime(), CONS.getTime()]);
                                deferred.resolve();
                            }
                            else {
                                out = CONS.getJson(100, "There is a problem while genrating chanelId . Please contact system admin", b);
                                deferred.resolve();
                            }
                        }
                        else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            //U.logError("genrate chanelId", err, "Internal server error", b);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var userDetails = function () {
                var deferred = Q.defer();
                var b = req.body;
                var out;
                con.query("select U.firstName,U.lastName,U.profileimage,D.deviceId from user U left join device D on U.userId=D.userId where U.userId=?",
                    [b.userId],
                    function (err, result) {
                        if (!err) {
                            if (result.length > 0) {
                                b.profileImage = result[0].profileImage;
                                b.name = result[0].firstName + " " + result[0].lastName;
                                deferred.resolve(b);
                            } else {
                                out = CONS.getJson(100, 'There is a problem while sending friend request', err);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, 'Internal server error.Please contact system admin', "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var friendDetails = function () {
                var deferred = Q.defer();
                var b = req.body;
                var out;
                con.query("select concat(U.firstName,' ',U.lastName)as name,U.profileimage,D.deviceId from user U left join device D on U.userId=D.userId where U.userId=?",
                    [b.friendId],
                    function (err, result) {
                        if (!err) {
                            if (result.length > 0) {
                                b.friendPushId = result[0].deviceId;
                                b.friendName = result[0].name;
                                b.friendImage = result[0].profileimage;
                                deferred.resolve(b);
                            } else {
                                out = CONS.getJson(100, 'There is a problem while getting friend details request', err);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, 'Internal server error.Please contact system admin', "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var saveNotification = function () {
                var deferred = Q.defer();
                var out;
                var notification = new Notification();
                notification.userName = b.friendName;
                notification.friendId = b.userId;
                notification.userId = b.friendId;
                notification.type = 'friendRequest';
                notification.text = b.name + " " + 'sent you a friend request';
                notification.userImgUrl = b.profileImage;
                notification.id = b.deviceId;
                notification.save(function (err, result) {
                    if (!err) {
                        var id = result.id;
                        if (typeof id != 'undefined') {
                            out = CONS.getJson(200, "Notification has been sent successfully", result);
                            deferred.resolve(b);
                        }
                        else {
                            out = CONS.getJson(100, "There is a problem while sending notification. Please contact system admin", b);
                            deferred.resolve(b);
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        deferred.resolve(b);
                    }
                });
                return deferred.promise;
            };
            genrateChalengeId()
                .then(function () {
                    return userDetails();
                })
                .then(function () {
                    return friendDetails();
                })
                .then(function (b) {
                    var notification = {};
                    var body = {};
                    notification.tag = 'friendRequest';
                    notification.title = b.name + " " + 'has invited for friend request';
                    body.userName = b.name;
                    body.userId = b.userId;
                    body.userImgUrl = b.userImgUrl;
                    notification.body = body;
                    var registrationIds = [];
                    registrationIds.push(b.friendPushId);
                    var status = 'open';
                    var requestId = null;
                    CONS.saveNotifecation(b.friendName, b.friendId, b.userId, b.profileImage, notification.title, notification.tag, notification.title, b.deviceId, requestId, status);
                    CONS.sendNotification(registrationIds, notification);
                    var out = CONS.getJson(200, 'friend request send successfully');
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
          * @api {put} /api/request/status Friend request AACEPT|REJECT|BLOCK|UNBLOCK
          * @apiDescription Friend request AACEPT|REJECT|BLOCK|UNBLOCK
          * @apiName Friend request AACEPT|REJECT|BLOCK|UNBLOCK
          * @apiGroup FriendRequest
          * @apiParam {string} userId (In body)
          * @apiParam {string} friendId (In body)
          * @apiParam {string} status (In body)
          * @apiParam {string} notificationId (In body)
         */
    app.put('/api/request/status', function (req, res) {
        var out;
        var b = req.body;
        pool.getConnection(function (err, con) {
            var friendRequetStatus = function () {
                var deferred = Q.defer();
                if (b.status == 'accept') {
                    con.query("update friend set status=? where userId=? AND friendId=?",
                        [b.status, b.userId, b.friendId], function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    out = CONS.getJson(200, "Friend request accepted successfully");
                                    res.json(out);
                                    deferred.resolve(out);
                                } else {
                                    out = CONS.getJson(100, "There is a problem when accept friend request", b);
                                    res.json(out);
                                    deferred.reject(out);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                res.json(out);
                                deferred.reject(out);
                            }
                        });
                } else if (b.status == 'block') {
                    con.query("update friend set status=? where userId=? AND friendId=?",
                        [b.status, b.userId, b.friendId], function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    out = CONS.getJson(200, "User blocked successfully");
                                    res.json(out);
                                    deferred.resolve(out);
                                } else {
                                    out = CONS.getJson(100, "There is a problem when blocked User", b);
                                    res.json(out);
                                    deferred.reject(out);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                res.json(out);
                                deferred.reject(out);
                            }
                        });
                } else if (b.status == 'reject') {
                    con.query("update friend set status=? where userId=? AND friendId=?",
                        [b.status, b.userId, b.friendId], function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    out = CONS.getJson(200, "Friend request reject successfully");
                                    res.json(out);
                                    deferred.resolve(out);
                                } else {
                                    out = CONS.getJson(100, "There is a problem when reject User", b);
                                    res.json(out);
                                    deferred.reject(out);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                res.json(out);
                                deferred.reject(out);
                            }
                        });
                } else if (b.status == 'unfriend') {
                    con.query("update friend set status=? where userId=? AND friendId=?",
                        [b.status, b.userId, b.friendId], function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    out = CONS.getJson(200, "User unfriend successfully");
                                    res.json(out);
                                    deferred.resolve(out);
                                } else {
                                    out = CONS.getJson(100, "There is a problem when unfriend User", b);
                                    res.json(out);
                                    deferred.reject(out);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                res.json(out);
                                deferred.reject(out);
                            }
                        });
                }
                else if (b.status == 'unblock') {
                    con.query("update friend set status=? where userId=? AND friendId=?",
                        [b.status, b.userId, b.friendId], function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    out = CONS.getJson(200, "User unblock successfully");
                                    res.json(out);
                                    deferred.resolve(out);
                                } else {
                                    out = CONS.getJson(100, "There is a problem when blocked User", b);
                                    res.json(out);
                                    deferred.reject(out);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                res.json(out);
                                deferred.reject(out);
                            }
                        });
                } else {
                    out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                    res.json(out);
                    deferred.reject(out);
                }
                return deferred.promise;
            };
            var joinerDetails = function (out) {
                var deferred = Q.defer();
                var registrationids = [];
                var notification = {};
                con.query('select profileImage,concat(firstName," ",lastName)as displayName from user where userId=?',
                    [b.userId],
                    function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                b.displayName = data[0].displayName;
                                b.profileImage = data[0].profileImage;
                                deferred.resolve(out);
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
            }
            var notiFy = function (out) {
                var deferred = Q.defer();
                var registrationids = [];
                var notification = {};
                con.query('select deviceId from device where userId =?',
                    [b.friendId],
                    function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                var status = 'close';
                                registrationids[0] = data[0].deviceId;
                                notification.tag = 'friendRequest';
                                notification.title = b.displayName + ' ' + 'accept your friend request';
                                CONS.sendNotification(registrationids, notification);
                                CONS.saveNotifecation(b.displayName, b.friendId, b.userId, b.profileImage, notification.title, notification.tag, notification.title, 0, 0, status);
                                deferred.resolve(out);
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
            friendRequetStatus()
                .then(function (out) {
                    return joinerDetails(out);
                })
                .then(function (out) {
                    return notiFy(out);
                })
                .then(function (out) {
                    U.updateNotification(b.notificationId);
                    con.release();
                    res.json(out);
                })
                .fail(function (out) {
                    con.release();
                    res.json(out);
                })
        });
    });


    //create chanelId
    app.post('/api/users/requests', function (req, res) {
        pool.getConnection(function (err, con) {
            var updateFriendStatus = function () {
                var deferred = Q.defer();
                var b = req.body;
                var out;
                con.query("update friend set status='accept' where userId=? AND friendId=?",
                    [b.userId, b.friendId],
                    function (err, result) {
                        if (!err) {
                            if (result.affectedRows > 0) {
                                con.query("update friend set status='accept' where userId=? AND friendId=?",
                                    [b.friendId, b.userId]);
                                deferred.resolve();
                            } else {
                                out = CONS.getJson(100, "There is a problem when accept friend request", b);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var getDeviceToken = function () {
                var deferred = Q.defer();
                var b = req.body;
                var out;
                con.query("select deviceId from device where userId=?",
                    [b.friendId],
                    function (err, result) {
                        if (!err) {
                            if (result.length > 0) {
                                b.deviceId = result[0].deviceId;
                                console.log("devicetoke", b);
                                deferred.resolve(b);
                            } else {
                                out = CONS.getJson(100, "there is an problem while accept friend request", err);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error.Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    })
                return deferred.promise;
            };
            var userDetails = function () {
                var deferred = Q.defer();
                var b = req.body;
                var out;
                con.query("select firstName,lastName,profileImage from user where userId=?",
                    [b.userId],
                    function (err, result) {
                        if (!err) {
                            if (result.length > 0) {
                                b.profileImage = result[0].profileImage;
                                b.name = result[0].firstName + " " + result[0].lastName;
                                deferred.resolve(b);
                            } else {
                                out = CONS.getJson(100, 'There is a problem while accepting friend request', err);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, 'Internal server error.Please contact system admin', "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };

            var saveNotification = function (b) {
                var deferred = Q.defer();
                var out;
                var notification = new Notification();
                notification.userName = b.name;
                notification.userId = b.userId;
                notification.type = 'friendRequest';
                notification.text = b.name + " " + 'accept your friend request';
                notification.userImgUrl = b.profileImage;
                notification.id = b.deviceId;
                notification.save(function (err, result) {
                    if (!err) {
                        var id = result.id;
                        if (typeof id != 'undefined') {
                            out = CONS.getJson(200, "Notification has been sent successfully", result);
                            deferred.resolve(b);
                        }
                        else {
                            out = CONS.getJson(100, "There is a problem while sending notification. Please contact system admin", b);
                            deferred.resolve(b);
                        }
                    }
                    else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        deferred.resolve(b);
                    }
                });
                return deferred.promise;
            };
            var deleteRequest = function () {
                var deferred = Q.defer();
                var out;
                var b = req.body;
                Notification.update({ _id: b.requestId }, { $set: { status: 'delete' } }, function (err, result) {
                    if (!err) {
                        out = CONS.getJson(200, "request cancel successfully");
                        deferred.resolve(b);
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        deferred.resolve(b);
                    }
                });
                return deferred.promise;
            };
            updateFriendStatus()
                .then(function () {
                    return getDeviceToken();
                })
                .then(function () {
                    return userDetails();
                })
                .then(function (b) {
                    return saveNotification(b);
                })
                .then(function (b) {
                    return deleteRequest(b);
                })
                .then(function (b) {
                    U.updateNotification(b.notificationId);
                    var notification = {};
                    var registrationIds = [];
                    notification.tag = 'friendRequest';
                    notification.title = b.name + " " + 'accept your friend request';
                    registrationIds.push(b.deviceId);
                    CONS.sendNotification(registrationIds, notification);
                    var out = CONS.getJson(200, 'friend request accepted successfully');
                    con.release();
                    res.json(out);
                })
                .fail(function (out) {
                    con.release();
                    res.json(out);
                })
        });

    });

    app.post('/api/users/requests/cancel', function (req, res) {
        pool.getConnection(function (err, con) {
            var updateFriendStatus = function () {
                var deferred = Q.defer();
                var b = req.body;
                var out;
                con.query("update friend set status='cancel' where userId=? AND friendId=?",
                    [b.userId, b.friendId],
                    function (err, result) {
                        if (!err) {
                            if (result.affectedRows > 0) {
                                deferred.resolve();
                            } else {
                                out = CONS.getJson(100, "There is an problem when cancel request", b);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var deleteRequest = function () {
                var deferred = Q.defer();
                var out;
                var b = req.body;
                Notification.update({ _id: b.requestId }, { $set: { status: 'delete' } }, function (err, result) {
                    if (!err) {
                        out = CONS.getJson(200, "request cancel successfully");
                        deferred.resolve(out);
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        deferred.resolve();
                    }
                });
                return deferred.promise;
            };
            updateFriendStatus()
                .then(function () {
                    return deleteRequest();
                })
                .then(function (out) {
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
         * @api {post} /api/send/notiications Send notification
         * @apiName Send notification
         * @apiDescription Send notification
         * @apiGroup Notification
         * @apiParam {string} userId . In body
         * @apiParam {string} friendId . In body
         * @apiParam {strin} message . In Header
         * @apiParam {strin} authToken . In Header
         * @apiParam {strin} profileImg . In body - Sender profile image
         * @apiParam {strin} displayName . In body - fullName Message sender full name
       */

    app.post('/api/send/notiications', function (req, res) {
        var out;
        var b = req.body;
        console.log('input param', b);
        var notification = {};
        var registrationIds = [];
        pool.getConnection(function (err, con) {
            if (!err) {
                var getUserPushId = function () {
                    var defeered = Q.defer();
                    con.query('select deviceId from device where userId=?',
                        [b.friendId],
                        function (err, data) {
                            if (!err) {
                                try {
                                    var message
                                    registrationIds.push(data[0].deviceId);
                                    registrationids[0] = data[0].deviceId;
                                    // b.friendId = data[0].userId;
                                    // notification.tag = 'chat';
                                    // notification.title = 'message from ' + b.displayName;
                                    data = { displayName: b.displayName, profileImg: b.profileImg, message: b.message, userId: b.userId, title: "Message from " + b.fullName };
                                    CONS.sendNotification(registrationids, data);
                                } catch (err) {
                                    console.log(err);
                                }
                                defeered.resolve();
                            } else {
                                out = U.getJson(300, "Internal server error. Please contact system admin", "", err);
                                U.logError("getUserPushId", err, "Error on send notification", b);
                                defeered.resolve();
                            }
                        })
                    return defeered.promise;
                };
                getUserPushId()
                    .then(function () {
                        out = U.getJson(200, 'success');
                        con.release();
                        res.json(out);
                    })
                    .fail(function () {
                        out = U.getJson(100, 'error');
                        con.release();
                        res.json(out);
                    })
            } else {
                out = U.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("savePlayCount", err, "Error on save play count", b);
                res.json(out);
            }
        })
    });
}



