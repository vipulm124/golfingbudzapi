var U = require('./../util/util');
var Post = require('./../model/post-model');
var Like = require('./../model/post-like.model');
var CONS = require("./../util/const");
var Comment = require('./../model/post-comment.model');
var mongoose = require('mongoose');
var Q = require('q');
module.exports = function (app, pool) {


    app.post('/api/posts', function (req, res) {
        var b = req.body;
        console.log("body from new post :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {
            con.query('INSERT INTO blog (userId,blogType,postType,blogImage,title,text,dateCreated,dateModified,thumbUrl) VALUES(?,?,?,?,?,?,?,?,?)', [b.userId, 1, b.postType, b.image, b.text, b.text, CONS.getTime(), CONS.getTime(),b.thumbUrl],
                function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            out = CONS.getJson(200, "Your post is successfully posted.", "");

                        } else {
                            out = CONS.getJson(100, "Invalid post details", b);
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);

                    }
                    con.release();
                    res.json(out);
                });
        });
    });



    //get all the posts from all the users
    app.get('/api/posts/:userId', function (req, res) {
        var b = req.body;
        console.log("body from new post :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {
            con.query('SELECT blog.*,postLikes.likeStatus FROM blog left outer join postLikes on postLikes.postId=blog.Id order by blog.id desc', [req.params.userId],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "No posts found.");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get posts by userid", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    //lookup post of specific user
    app.get('/api/users/:userId/posts', function (req, res) {
        var b = req.body;
        console.log("body from new post :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {
            con.query('CALL GetLikeDetails(?)', [req.params.userId],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows[0]);
                        else {
                            out = CONS.getJson(100, "No posts found.");
                        }
                    } else {
                        console.log(err);
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get posts by userid", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

    //Write comment on a post
 app.post('/api/posts/comment', function (req, res) {
        var b = req.body;
        console.log("body from new post :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {
            con.query('INSERT INTO postComments (postId,userId,comment,userName,userImgUrl) VALUES (?,?,?,?,?)', [b.postId,b.userId,b.comment,b.userName,b.userImgUrl],
                function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            out = CONS.getJson(200, "You comment is added successfully.", "");

                        } else {
                            out = CONS.getJson(100, "Unable to comment. Please try again later", b);
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);

                    }
                    con.release();
                    res.json(out);
                });
        });
    });

    
      app.get('/api/posts/comments/:postId', function (req, res) {
        var b = req.body;
        console.log("body from new post :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {
            con.query('SELECT * from postComments where postId=?', [req.params.postId],
                function (err, rows) {
                    var out;
                    if (!err) {
                        if (rows.length > 0)
                            out = CONS.getJson(200, "Success", rows);
                        else {
                            out = CONS.getJson(100, "No comments found.");
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        U.logError("get posts by userid", err, "Internal server error. Please contact system admin", req.params);
                    }
                    con.release();
                    res.json(out)
                });
        });
    });

   
    //lookup post like by postId

    app.get('/api/posts/:postId/likes', function (req, res) {
        Like.find({
            postId: req.params.postId
        }, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "Like doesn't exist. Please check postId");
                }
            } else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get like by postId", err, "Internal server error. Please contact system admin", req.params);
            }
            res.json(out)
        });
    });


 

    app.get('/api/posts/:postId', function (req, res) {
        Post.find({
            "_id": req.params.postId
        }, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "post doesn't exist. Please check postId");
                }
            } else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
            }
            res.json(out)
        });
    });

    app.post('/api/posts/like', function (req, res) {
        var b = req.body;
        console.log("body from new post :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {
            con.query('CALL spLikePost(?,?)', [b.postId,b.userId],
                function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            out = CONS.getJson(200, "Thanks for liking the post.", "");

                        } else {
                            out = CONS.getJson(100, "Cannot like now. Please try again later.", b);
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);

                    }
                    con.release();
                    res.json(out);
                });
        });
    });



    //Check userId in likes array
    app.post('/api/posts/like_old', function (req, res) {
        var out;
        var b = req.body;
        var checkUserId = function () {
            var deferred = Q.defer();
            Post.find({
                _id: req.body.postId,
                likes: {
                    $in: [req.body.userId]
                }
            },
                function (err, result) {
                    if (!err) {
                        if (result.length > 0) {
                            out = CONS.getJson(200, "Success");
                            disLikePost(req.body.postId, req.body.userId);
                            decreaseLikeCount(req.body.postId);
                            res.json(out);
                        } else {
                            deferred.resolve();
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        deferred.reject(err);
                    }
                });
            return deferred.promise;
        };

        var likePost = function () {
            var deferred = Q.defer();
            Post.update({
                _id: req.body.postId
            }, {
                    $push: {
                        likes: req.body.userId
                    }
                },
                function (err, data) {
                    if (!err) {
                        if (data.ok == 1) {
                            out = CONS.getJson(200, "You liked it");
                            deferred.resolve(out);
                        } else {
                            out = CONS.getJson(100, "Internal server error. Please contact system admin", "", err);
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        deferred.reject(err);
                    }
                });
            return deferred.promise;
        };
        var increaseLikeCount = function (out) {
            var deferred = Q.defer();
            Post.update({
                _id: req.body.postId
            }, {
                    $inc: {
                        likeCount: 1
                    }
                },
                function (err, data) {
                    if (!err) {
                        if (data.ok == 1) {
                            deferred.resolve(out);
                        } else {
                            out = CONS.getJson(100, "Internal server error. Please contact system admin", "", err);
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                        deferred.reject(err);
                    }
                });
            return deferred.promise;
        };
        var savePostData = function (out) {
            var deferred = Q.defer();
            var newLike = new Like();
            newLike.userName = b.userName;
            newLike.userId = b.userId;
            newLike.postId = b.postId;
            newLike.save(function (err, result) {
                if (!err) {
                    var postId = result.id;
                    if (typeof postId != 'undefined') {
                        deferred.resolve(out);
                    } else {
                        out = CONS.getJson(100, "There is a problem while liking Post. Please contact system admin", b);
                        deferred.resolve(out);
                    }
                } else {
                    deferred.reject(err);
                }
            });
            return deferred.promise;
        };
        checkUserId()
            .then(function () {
                return likePost();
            })
            .then(function (out) {
                return increaseLikeCount(out);
            })
            .then(function (out) {
                return savePostData(out);
            })
            .then(function (out) {
                res.json(out);
            })
            .fail(function (e) {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", e);
                res.json(out);
            })
    });


    var disLikePost = function (postId, userId) {
        var deferred = Q.defer();
        Post.update({
            _id: postId
        }, {
                $pull: {
                    likes: userId
                }
            },
            function (err, data) {
                if (!err) {
                    if (data.ok == 1) {
                        console.log("succes");
                    } else {
                        console.log("Internal server error. Please contact system admin", "", err);
                    }
                } else {
                    console.log("Internal server error. Please contact system admin", "", err);
                }
            });
    };

    var decreaseLikeCount = function (postId) {
        var deferred = Q.defer();
        Post.update({
            _id: postId
        }, {
                $inc: {
                    likeCount: -1
                }
            },
            function (err, data) {
                if (!err) {
                    if (data.ok == 1) {
                        console.log("succes");
                    } else {
                        console.log("Internal server error. Please contact system admin", "", err);
                    }
                } else {
                    console.log("Internal server error. Please contact system admin", "", err);
                }
            });
    };

    //Increase comment count of an post
    var increaseCommentCount = function (postId) {
        var deferred = Q.defer();
        Post.update({
            _id: postId
        }, {
                $inc: {
                    commentCount: 1
                }
            },
            function (err, data) {
                if (!err) {
                    if (data.ok == 1) {
                        console.log("succes");
                    } else {
                        console.log("Internal server error. Please contact system admin", "", err);
                    }
                } else {
                    console.log("Internal server error. Please contact system admin", "", err);
                }
            });
    };

    //get all post of my and my friend
    // app.get('/api/users/:id/posts', function (req, res) {
    //     pool.getConnection(function (err, con) {
    //         var getAllFriendId = function () {
    //             var ids = [];
    //             var deferred = Q.defer();
    //             console.log("body content: %j", req.body);
    //             con.query("select friendId from friend where userId=?",
    //                 [req.params.id],
    //                 function (err, rows) {
    //                     var out;
    //                     if (!err) {
    //                         if (rows.length > 0) {
    //                             deferred.resolve(rows);
    //                         }
    //                         else {
    //                             out = CONS.getJson(100, "There is a problem while getting post. Please contact system admin");
    //                             deferred.resolve(out);
    //                         }
    //                     }
    //                     else {
    //                         out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
    //                         deferred.reject(out);
    //                     }
    //                 });
    //             return deferred.promise;
    //         };
    //         var makeArray = function (rows) {
    //             var deferred = Q.defer();
    //             var ids = [];
    //             for (var i = 0; i < rows.length; i++)
    //                 ids.push(rows[i].friendId);
    //             ids.push(req.params.id);
    //             console.log(ids);
    //             deferred.resolve(ids);
    //             return deferred.promise;
    //         };
    //         var findPost = function (ids) {
    //             var deferred = Q.defer();
    //             Post.find({ userId: { $in: ids } }, function (err, rows) {
    //                 var out;
    //                 if (!err) {
    //                     if (rows.length > 0) {
    //                         out = CONS.getJson(200, "Success", rows);
    //                         deferred.resolve(out);
    //                     } else {
    //                         out = CONS.getJson(100, "No post found");
    //                         res.json(out);
    //                     }
    //                 }
    //                 else {
    //                     out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
    //                     deferred.reject(out);
    //                 }
    //             }).sort({ "createdAt": -1 });
    //             return deferred.promise;
    //         };
    //         getAllFriendId()
    //             .then(function (rows) {
    //                 return makeArray(rows);
    //             })
    //             .then(function (ids) {
    //                 return findPost(ids);
    //             })
    //             .then(function (out) {
    //                 con.release();
    //                 res.json(out);
    //             })
    //             .fail(function (out) {
    //                 con.release();
    //                 res.json(out);
    //             })

    //     });
    //});
    //Get all post 
    app.get('/api/posts', function (req, res) {
        var offset = parseInt(req.query.offset);
        if (!offset)
            offset = 0;
        var pageSize = parseInt(req.query.pageSize);
        if (!pageSize)
            pageSize = 2;
        Post.paginate({}, {
            offset,
            limit: pageSize
        }).then(function (err, rows) {
            var out;

            if (err.docs.length > 0) {
                out = CONS.getJson(200, "Success", err.docs);
            } else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get All events", err, "Internal server error. Please contact system admin", req.params);
            }
            res.json(out)
        });
    });

     app.delete('/api/posts/:id', function (req, res) {
        var b = req.body;
        console.log("body from new post :  %j", b);
        var out = {};
        pool.getConnection(function (err, con) {
            con.query('CALL spDeletePosts(?)', [req.params.id],
                function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            out = CONS.getJson(200, "You post is deleted successfully.", "");

                        } else {
                            out = CONS.getJson(100, "Unable to delete post. Please try again later", b);
                        }
                    } else {
                        out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);

                    }
                    con.release();
                    res.json(out);
                });
        });
    });

    
}