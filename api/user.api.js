'use strict';
var C = require("./../util/config");
var CONS = require("./../util/const");
var U = require("./../util/util");
var Q = require('q');

module.exports = function (app, pool) {

    /**
     * @api {post} /api/register Add new user
     * @apiDescription Add new user
     * @apiName Add new user
     * @apiGroup Users
     * @apiParam {string} email (In body)
     * @apiParam {string} password (In body)
     * @apiParam {string} firstName (In body)
     * @apiParam {string} lastName (In body)
     * @apiParam {string} profileImage (In body)
     * @apiParam {string} userType (In body)
     * @apiParam {string} country (In body)
     * @apiParam {string} clubName (In body)
     * @apiParam {string} description (In body)
     * @apiParam {string} address (In body)
     * @apiParam {string} city (In body)
     * @apiParam {string} subRub (In body)
     * @apiParam {string} operatingHours (In body)
     * @apiParam {string} deviceType (In body)
     * @apiParam {string} imeiNo (In body)
     * @apiParam {string} deviceId (In body)(device id id fcm push key)
     */
    app.post('/api/register', function (req, res) {
        pool.getConnection(function (err, con) {
            var out;
            var userRegistration = function () {
                var auth_token = CONS.generateAuthToken();
                var deferred = Q.defer();
                var b = req.body;
                var row = {};
                console.log("body content: %j", req.body);
                if (b.userType == "Individual") {
                    console.log("hello i am here");
                    var sqlQuery = "insert into user (email,password,firstName,lastName,profileImage,userType,dateCreated,dateModified,country,auth_token) values('" + b.email + "','" + b.password + "','" + b.firstName + "','" + b.lastName + "','" + b.profileImage + "','" + b.userType + "','" + CONS.getTime() + "','" + CONS.getTime() + "','" + b.country + "','" + auth_token + "')";
                } else {
                    var sqlQuery = "insert into user (email,password,firstName,lastName,profileImage,userType,dateCreated,dateModified,country,clubName,description,address,city,subRub,operatingHours,auth_token) values('" + b.email + "','" + b.password + "','" + b.firstName + "','" +
                        b.lastName + "','" + b.profileImage + "','" + b.userType + "','" + CONS.getTime() + "','" + CONS.getTime() + "','" + b.country + "','" + b.clubName + "','" + b.description + "','" + b.address + "','" + b.city + "','" + b.subRub + "','" + b.operatingHours + "','" + auth_token + "')";
                }

                con.query(sqlQuery, function (err, rows) {
                    var out;
                    if (!err) {
                        var userId = rows.insertId;
                        console.log("userId", userId);
                        if (userId > 0) {
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
                            CONS.logError("add User", rows, "might be fields are missing", b);
                            deferred.reject(out);
                        }
                    } else {
                        if (err.code == "ER_DUP_ENTRY") {
                            out = CONS.getJson(100, 'Email already exist');
                            deferred.resolve(out);
                        }
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        CONS.logError("add user", err, "Internal server error", b);
                        deferred.resolve(out);
                    }
                });
                return deferred.promise;
            };

            var deviceDetails = function (userResult) {
                var deferred = Q.defer();
                var b = req.body;
                console.log("body content: %j", req.body);

                con.query("insert into device (userId,deviceType,imeiNo,deviceId,dateModified,dateCreated) values(?,?,?,?,?,?)", [b.userId, b.deviceType, b.imeiNo, b.deviceId, CONS.getTime(), CONS.getTime()],

                    function (err, rows) {
                        var out;
                        if (!err) {
                            var id = rows.insertId;
                            if (id > 0) {
                                b.id = id;
                                deferred.resolve(userResult);
                            } else {
                                out = CONS.getJson(100, "There is a problem while adding device details. Please contact system admin", b);
                                U.logError("add device details", rows, "might be fields are missing", b);
                                deferred.resolve(userResult);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            U.logError("add device details", err, "Internal server error", b);
                            deferred.resolve(out);
                        }
                    });
                return deferred.promise;
            };

            userRegistration()
                .then(function (userResult) {
                    return deviceDetails(userResult);
                })
                .then(function (out) {
                    //out = CONS.getJson(200, "user register successfully", out)
                    con.release();
                    res.json(out);
                })
                .fail(function (e) {
                    out = CONS.getJson(300, "Internal server error. Please contact system admin", "", e);
                    con.release();
                    res.json(out);
                })


        });
    });

    /**
     * @api {post} /api/forgotpassword  Forgot Password
     * @apiDescription Forgot Password
     * @apiName Forgot Password
     * @apiGroup Users
     * @apiParam {string} email (In body) 
     */
    app.post('/api/forgotpassword', function (req, res) {
        var b = req.body;
        console.log("body from update :  %j", b);
        var out = {};
        var otp = U.getOTP();
        pool.getConnection(function (err, con) {
            con.query('update user set otp =?,password=? where email=?', [otp, otp, b.email],
                function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            out = CONS.getJson(200, "Your temporary password send on your registered email", "");

                        } else {
                            out = CONS.getJson(100, "Invalid login details", b);
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);

                    }
                    con.release();
                    res.json(out);
                });
        });
    });

    /**
     * @api {put} /api/changepassword  Change Password
     * @apiDescription Change Password
     * @apiName Change Password
     * @apiGroup Users
     * @apiParam {string} newPassword (In body) 
     * @apiParam {string} userId (In body) 
     * @apiParam {string} password (In body) 
     */
    app.put('/api/changepassword', function (req, res) {
        var b = req.body;
        console.log("body from update :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {

            con.query('update user set password =? where userId=? AND password=?', [b.newPassword, b.userId, b.password],
                function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            out = CONS.getJson(200, "user password change successfully");

                        } else {
                            out = CONS.getJson(100, "Invalid login details", b);
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);

                    }
                    con.release();
                    res.json(out);
                });
        });
    });

    /**
     * @api {get} /api/users/:id  Get User profile
     * @apiDescription Get User profile
     * @apiName Get User profile
     * @apiGroup Users
     * @apiParam {string} id (In url)  . Id is userId
     */
    app.get('/api/users/:userId', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select * from user where isActive=1 AND userId=?", [req.params.userId],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "User doesn't exist. Please check userId");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get consumer by id", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });


    /**
     * @api {put} /api/users/:id  Update user profile
     * @apiDescription Update user profile
     * @apiName Update user profile
     * @apiGroup Users
     * @apiParam {string} id (In url) . id is userid
     * @apiParam {string} firstName (In body)
     * @apiParam {string} lastName (In body)
     * @apiParam {string} email (In body)
     * @apiParam {string} profileImage (In body)
     * @apiParam {string} country (In body)
     * @apiParam {string} handicap (In body)
     * @apiParam {string} noOfHandicap (In body)
     * @apiParam {string} strength (In body)
     * @apiParam {string} sex (In body)
     * @apiParam {string} affiliated (In body)
     * @apiParam {string} age (In body)
     * @apiParam {string} profession (In body)
     * @apiParam {string} roundsPerMonth (In body)
     * @apiParam {string} refer (In body)
     * @apiParam {string} playWithUs (In body)
     * @apiParam {string} playWithOther (In body)
     * @apiParam {string} course (In body)
     * @apiParam {string} location (In body)
     * @apiParam {string} contact (In body)
     * @apiParam {string} clubName (In body)
     * @apiParam {string} description (In body)
     * @apiParam {string} address (In body)
     * @apiParam {string} city (In body)
     * @apiParam {string} operatingHours (In body)
     * @apiParam {string} userId (In body)
     */
    app.put('/api/users/:id', function (req, res) {
        var b = req.body;
        b.userId = req.params.id;
        console.log("body from update :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {

            con.query('update user set firstName =?,lastName=?,email=?,profileImage=?,country=?,handicap=?,noOfHandicap=?,strength=?,weakness=?,sex=?,affiliated=?,age=?,profession=?,roundsPerMonth=?,refer=?,playWithUs=?,playWithOther=?,course=?,location=?,contact=?,clubName=?,description=?,address=?,city=?,subrub=?,operatingHours=? where userId=?', [b.firstName, b.lastName, b.email, b.profileImage, b.country, b.handicap, b.noOfHandicap, b.strength, b.weakness, b.sex, b.affiliated, b.age, b.profession, b.roundsPerMonth, b.refer, b.playWithUs, b.playWithOther, b.course, b.location, b.contact, b.clubName, b.description, b.address, b.city, b.subRub, b.operatingHours, b.userId],
                function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            out = CONS.getJson(200, "user profile update successfully", b);

                        } else {
                            console.log(err);
                            out = CONS.getJson(100, "There is a problem while updating user profile. Please contact system admin", b);
                        }
                    } else {
                        console.log(err);
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);

                    }
                    con.release();
                    res.json(out);
                });
        });
    });

    /**
     * @api {get} /api/users/:name/search  Search user by name
     * @apiDescription Search user by name
     * @apiName Search user by name
     * @apiGroup Users
     * @apiParam {string} name (In url) 
     */
    app.get('/api/users/:name/search', function (req, res) {
        console.log(req.params.name);
        pool.getConnection(function (err, con) {

            con.query("select userId,firstName,lastName,email,profileImage,country,handicap,strength,weakness from user where firstName LIKE ?", [req.params.name],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "User doesn't exist. Please check name");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    /**
     * @api {post} /api/items  Post an item for sale
     * @apiDescription Post an item for sale
     * @apiName Post an item for sale
     * @apiGroup Items
     * @apiParam {string} userId (In body) 
     * @apiParam {string} price (In body) 
     * @apiParam {string} description (In body) 
     * @apiParam {string} userName (In body) 
     * @apiParam {string} userImgUrl (In body) 
     * @apiParam {string} image (In body)
     * @apiParam {string} title (In body)
     */
    app.post('/api/items', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.body;
            console.log("body content: %j", req.body);
            con.query("insert into item(userId,price,description,userName,userImgUrl,image,status,title)values(?,?,?,?,?,?,?,?)", [b.userId, b.price, b.description, b.userName, b.userImgUrl, b.image, 'open', b.title],
                function (err, result) {
                    var out;
                    if (!err) {
                        var id = result.insertId;
                        if (id > 0) {
                            out = CONS.getJson(200, "Item posted Successfully");
                        } else {
                            out = CONS.getJson(100, "There is a problem while post an item. Please contact system admin", b);
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("post item", err, "Internal server error", b);
                    }
                    con.release();
                    res.json(out);
                });
        });
    });

    /**
     * @api {get} /api/items  Get all Items for sale
     * @apiDescription Get all Items for sale
     * @apiName Get all Items for sale
     * @apiGroup Items
     */
    app.get('/api/items', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select * from item where status='open'",
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "Item doesn't exist.");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get item for sell", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    /**
     * @api {put} /api/items  Buy an item
     * @apiDescription Buy an item
     * @apiName Buy an item
     * @apiGroup Items
     * @apiParam {string} userId (In body) 
     * @apiParam {string} itemId (In body) 
     */
    app.put('/api/items', function (req, res) {
        var b = req.body;
        console.log("body from update :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {
            var sellItem = function () {
                var deferred = Q.defer();
                con.query("update item set status =? where id=?", ['close', b.itemId],
                    function (err, result) {
                        if (!err) {
                            if (result.affectedRows > 0) {
                                //out = CONS.getJson(200, "item soldout");
                                deferred.resolve();

                            } else {
                                out = CONS.getJson(100, "There is a problem while sold this item. Please contact system admin", b);
                                deferred.reject(out);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            var userByitems = function () {
                var deferred = Q.defer();
                con.query("insert into buyItems(userid,itemId,dateCreated,dateModified)values(?,?,?,?)", [b.userId, b.itemId, CONS.getTime(), CONS.getTime()],
                    function (err, result) {
                        var out;
                        if (!err) {
                            var id = result.insertId;
                            if (id > 0) {
                                out = CONS.getJson(200, "Item sold Successfully");
                                deferred.resolve(out);
                            } else {
                                out = CONS.getJson(100, "There is a problem while post an item. Please contact system admin", b);
                                deferred.resolve(out);
                            }
                        } else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            deferred.reject(out);
                        }
                    });
                return deferred.promise;
            };
            sellItem()
                .then(function () {
                    return userByitems();
                })
                .then(function (out) {
                    res.json(out);
                })
                .fail(function (e) {
                    out = CONS.getJson(300, "Internal server error. Please contact system admin", "", e);
                    con.release();
                    res.json(out);
                })

        });
    });


    /**
     * @api {get} /api/clubs/:id/members  Get all club
     * @apiDescription Get all club
     * @apiName Get all club
     * @apiGroup Users
     */
    app.get('/api/clubs/:userId', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("CALL spGetClubInfo(?)",[req.params.userId],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows[0]);
                        else {
                            out = CONS.getJson(100, "Could not find any cub.");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get All club", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    /**
     * @api {post} /api/clubs/join  Join club
     * @apiDescription Join club
     * @apiName Join club
     * @apiGroup Users
     * @apiParam {string} userId (In body) 
     * @apiParam {string} clubId (In body) 
     */
    app.post('/api/clubs/join', function (req, res) {
        pool.getConnection(function (err, con) {
            var b = req.body;
            console.log("body content: %j", req.body);
            con.query("CALL spToggleJoinClub(?,?,?,?)", [b.userId, b.clubId, CONS.getTime(), CONS.getTime()],
                function (err, result) {
                    var out;
                    if (!err) {
                        // var id = result.insertId;
                        // if (id > 0) {
                            out = CONS.getJson(200, "Join club Successfully", b);
                        // } else {
                        //     out = CONS.getJson(100, "There is a problem while Joining a club. Please contact system admin", b);
                        // }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("Join club", err, "Internal server error", b);
                    }
                    con.release();
                    res.json(out);
                });
        });
    });

    /**
     * @api {get} /api/clubs/:id/members  Get all member of an club
     * @apiDescription Get all member of an club
     * @apiName Get all member of an club
     * @apiGroup Users
     * @apiParam {string} id (In body) . id is userId
     */
    app.get('/api/clubs/:id/members', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select u.userid,u.firstName,u.lastName,u.profileimage from user u left join clubJoinee c on u.userId=c.userId where c.clubId=?", [req.params.id],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "No user found");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        //U.logError("get consumer by id", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    /**
     * @api {get} /api/users/:id/clubs Get All club of an Users
     * @apiDescription Get All club of an Users
     * @apiName Get All club of an Users
     * @apiGroup Users
     * @apiParam {string} id (In body) . id is userId
     */
    app.get('/api/users/:id/clubs', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select U.userid,U.clubName,U.description,U.profileimage,U.country,U.contact from user U where userId IN (select clubId from clubJoinee where userId=?)", [req.params.id],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "No club found");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        //U.logError("get consumer by id", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    /**
     * @api {get} /api/users Get all user
     * @apiDescription Get all user
     * @apiName Get all user
     * @apiGroup Users
     */
    app.get('/api/users', function (req, res) {
        pool.getConnection(function (err, con) {
            con.query("select * from user where isActive=1",
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "User not found");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("Get All users", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    app.put('/api/users/:id/profileimage', function (req, res) {
        var out;
        var b = req.body;
        b.userId = req.params.id;
        pool.getConnection(function (err, con) {
            if (!err) {
                var updateImage = function () {
                    var defer = Q.defer()
                    con.query("update device set deviceType=?,imeiNo=?,deviceId=?,dateModified=? where userId=?", [b.deviceType, b.imeiNo, b.deviceId, '0', b.userId], function (err, result) {
                        if (!err) {
                            out = CONS.getJson(200, "User profile image change successfully", b);
                            defer.resolve(out);
                        } else {
                            out = CONS.getJson(100, "There is a problem while change user profile image. Please contact system admin", b);
                            defer.reject(out);
                        }
                    })
                    return defer.promise;
                };
                updateImage()
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
        })
    })

    /**
     * @api {put} /api/users/token Update token
     * @apiName Update token
     * @apiDescription Update token
     * @apiGroup User
     * @apiParam {string} userId . - In header
     * @apiParam {string} authToken . - In header
     * @apiParam {string} token . in body 
     */

    app.put('/api/token', function (req, res) {
        var out;
        var b = req.body;
        b.userId = req.headers.userid;
        console.log("data from input;-", b);
        pool.getConnection(function (err, con) {
            if (!err) {
                var updateToken = function () {
                    var defeered = Q.defer();
                    con.query('update device set deviceId=? where userId=?', [b.token, b.userId], function (err, result) {
                        if (!err) {
                            out = CONS.getJson(200, 'success', b);
                            defeered.resolve(out);
                        } else {
                            out = CONS.getJson(300, 'An error occured', b.userId);
                            defeered.reject(out);
                        }
                    });
                    return defeered.promise;
                };
                updateToken()
                    .then(function (out) {
                        if (con != null)
                            con.release();
                        res.json(out);
                    })
                    .fail(function (out) {
                        if (con != null)
                            con.release();
                        res.json(out);
                    })
            } else {
                out = CONS.getJson(300, "Error in db connection", "", err);
                res.json(out);
            }
        })
    });
}