var C = require("./../util/config");
var U = require("./../util/util");
var CONS = require("./../util/const");
var Q = require('q');

module.exports = function (app, pool) {
    app.post('/api/login', function (req, res) {

        pool.getConnection(function (err, con) {
            if (!err) {
                var out;
                var userLogin = function () {
                    var deferred = Q.defer();
                    var b = req.body;
                    con.query('select userId,firstName,lastName,userType,email,profileImage,country,handicap,strength,weakness from user where email=? AND password=? AND isActive=1', [b.email, b.password],
                        function (err, rows) {
                            var out;
                            if (!err) {
                                // var row = rows[0];
                                // if (rows.length == 0) {
                                //     deferred.resolve(rows);
                                // } else
                                deferred.resolve(rows);
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", err);
                                U.logError("login user", err, "Internal server error.", b);
                                deferred.resolve(out);
                            }
                        });
                    return deferred.promise;
                };
                var deviceDetails = function (userResult) {
                    var deferred = Q.defer();
                    if (userResult == null) {
                        deferred.resolve(null);
                        return;
                    }
                    var b = req.body;
                    console.log("body content: %j", req.body);
                    b.userId = userResult[0].userId;
                    con.query("update device set deviceType=?,imeiNo=?,deviceId=?,dateModified=? where userId=?", [b.deviceType, b.imeiNo, b.deviceId, CONS.getTime(), b.userId],
                        function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    //out = CONS.getJson(200, "device details change successfully");
                                    deferred.resolve(userResult);
                                } else {
                                    //out = CONS.getJson(100, "There is a problem when trying to update device details", b);
                                    deferred.resolve(userResult);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                deferred.resolve(out);
                            }
                        });
                    return deferred.promise;
                };
                userLogin()
                    .then(function (userResult) {
                        console.log(userResult.length);
                        if (userResult.length == 0) {
                            return deviceDetails(null);
                        } else {
                            return deviceDetails(userResult);
                        }
                    })
                    .then(function (out) {
                        if (out == null) {
                            out = CONS.getJson(100, "Invalid credential. Please try again");
                        } else
                            out = CONS.getJson(200, "Logged in successfully", out);
                        con.release();
                        res.json(out);
                    })
                    .fail(function (e) {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", e);
                        con.release();
                        res.json(out);
                    })
            } else {
                out = CONS.getJson(300, 'Error in db connection');
                res.json(out);
            }
        });
    });

    app.post('/api/users/social/auth', function (req, res) {
        var out;
        var b = req.body;
        pool.getConnection(function (err, con) {
            if (!err) {
                var userLogin = function () {
                    var deferred = Q.defer();
                    con.query("select userId,firstName,lastName,userType,email,profileImage,country,handicap,strength,weakness from user where email=? AND isActive=1", [b.email, b.socialToken], function (err, data) {
                        if (!err) {
                            deferred.resolve(data);
                        } else {
                            out = CONS.getJson(100, "There is a problem while adding User. Please contact system admin", b);
                            // U.logError("userLogin", rows, "might be fields are missing", b);
                            deferred.reject(out);
                        }
                    });
                    return deferred.promise;
                };
                var userRegistration = function () {
                    var auth_token = CONS.generateAuthToken();
                    var deferred = Q.defer();
                    var b = req.body;
                    var row = {};
                    console.log("body content: %j", req.body);
                    if (b.userType == "Individual") {
                        console.log("hello i am here");
                        var sqlQuery = "insert into user (email,password,firstName,lastName,profileImage,userType,dateCreated,dateModified,country,auth_token) values('" + b.email + "','" + b.socialToken + "','" + b.firstName + "','" + b.lastName + "','" + b.profileImage + "','" + b.userType + "','" + CONS.getTime() + "','" + CONS.getTime() + "','" + b.country + "','" + auth_token + "')";
                    } else {
                        var sqlQuery = "insert into user (email,password,firstName,lastName,profileImage,userType,dateCreated,dateModified,country,clubName,description,address,city,subRub,operatingHours,auth_token,socialToken) values('" + b.email + "','" + b.socialToken + "','" + b.firstName + "','" +
                            b.lastName + "','" + b.profileImage + "','" + b.userType + "','" + CONS.getTime() + "','" + CONS.getTime() + "','" + b.country + "','" + b.clubName + "','" + b.description + "','" + b.address + "','" + b.city + "','" + b.subRub + "','" + b.operatingHours + "','" + auth_token + "','" + b.socialToken + "')";
                    }
                    con.query(sqlQuery, function (err, rows) {
                        var out;
                        if (!err) {
                            var userId = rows.insertId;
                            b.userId = userId;
                            console.log("userId", userId);
                            if (userId > 0) {
                                deviceDetails(con, b);
                                b.userId = userId;
                                row.userId = userId;
                                row.firstName = b.firstName;
                                row.lastName = b.lastName;
                                row.email = b.email;
                                row.profileImage = b.profileImage;
                                row.country = b.country;
                                row.handicap = b.handicap;
                                row.strength = b.strength;
                                row.userType = b.userType;
                                row.weakness = b.weakness;
                                out = CONS.getJson(200, "user register successfully", row)
                                deferred.resolve(out);
                            } else {
                                out = CONS.getJson(100, "There is a problem while adding User. Please contact system admin", b);
                                //U.logError("add User", rows, "might be fields are missing", b);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            //U.logError("add user", err, "Internal server error", b);
                            deferred.resolve(out);
                        }
                    });
                    return deferred.promise;
                };
                var updateDeviceDetails = function (userResult) {
                    var deferred = Q.defer();
                    if (userResult == null) {
                        deferred.resolve(null);
                        return;
                    }
                    var b = req.body;
                    console.log("body content: %j", req.body);
                    b.userId = userResult[0].userId;
                    con.query("update device set deviceType=?,imeiNo=?,deviceId=?,dateModified=? where userId=?", [b.deviceType, b.imeiNo, b.deviceId, '0', b.userId],
                        function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    out = CONS.getJson(200, "User login successfully", userResult);
                                    deferred.resolve(out);
                                } else {
                                    out = CONS.getJson(200, "User login successfully", userResult);
                                    deferred.resolve(out);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                deferred.resolve(out);
                            }
                        });
                    return deferred.promise;
                };
                var sendResponse = function () {
                    var deferred = Q.defer();
                    out = CONS.getJson(100, 'no data found');
                    deferred.reject(out);
                    return deferred.promise;
                };
                userLogin()
                    .then(function (data) {
                        if (data != null && data.length > 0) {
                            return updateDeviceDetails(data);
                        } else {
                            return sendResponse()
                        }
                    })
                    .then(function (out) {
                        con.release();
                        res.json(out);
                    })
                    .fail(function (out) {
                        con.release();
                        res.json(out);
                    })
            } else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                res.json(out);
            }
        });
    });

    //when user requests logout, destroy session data
    app.put('/api/logout/:userId', function (req, res) {
        var out;
        pool.getConnection(function (err, con) {
            if (!err) {
                var userLogout = function () {
                    var deferred = Q.defer();
                    con.query("update user U set auth_token='' where U.userId=?", [req.params.userId], function (err, rows) {
                        if (!err) {
                            out = CONS.getJson(200, "User Logged out successfully.");
                            deferred.resolve(out);
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                    return deferred.promise;
                };
                var deviceDetail = function (logoutResult) {
                    var deferred = Q.defer();
                    con.query("update device set imeiNo='',deviceId=''where userId=?", [req.params.userId],
                        function (err, result) {
                            if (!err) {
                                if (result.affectedRows > 0) {
                                    deferred.resolve(logoutResult);
                                } else {
                                    out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                    deferred.resolve(logoutResult);
                                }
                            } else {
                                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                                deferred.reject(out);
                            }
                        });
                    return deferred.promise;
                };
                userLogout()
                    .then(function (logoutResult) {
                        return deviceDetail(logoutResult);
                    })
                    .then(function (out) {
                        con.release();
                        res.json(out);
                    })
                    .fail(function (out) {
                        con.release();
                        res.json(out);
                    })
            } else {
                out = common.getJson(300, "Internal server error. Please contact system admin", "", err);
                con.release();
                res.json(out);
            }
        });

    });

    var deviceDetails = function (con, b) {

        console.log("body content: %j", b);

        con.query("insert into device (userId,deviceType,imeiNo,deviceId,dateModified,dateCreated) values(?,?,?,?,?,?)", [b.userId, b.deviceType, b.imeiNo, b.deviceId, CONS.getTime(), CONS.getTime()],

            function (err, rows) {
                var out;
                if (!err) {
                    var id = rows.insertId;
                    if (id > 0) {
                        b.id = id;
                    } else {
                        out = CONS.getJson(100, "There is a problem while adding device details. Please contact system admin", b);
                        //U.logError("add device details", rows, "might be fields are missing", b);
                    }
                } else {
                    out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                    //U.logError("add device details", err, "Internal server error", b);
                }
            });
    };
}