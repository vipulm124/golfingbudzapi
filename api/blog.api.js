var U = require('./../util/util');
var CONS = require("./../util/const");
var Blog = require('./../model/blog.model');
var Like = require('./../model/post-like.model');
var Comment = require('./../model/post-comment.model');
var mongoose = require('mongoose');
var Q = require('q');
module.exports = function (app, pool) {
    //Write a blog
    app.post('/api/blogs', function (req, res) {
        var out;
        var b = req.body;
        var str = req.body.text;
        var shortText = str.slice(1, 15);
        var blog = new Blog();
        blog.userName = b.userName;
        blog.userId = b.userId;
        blog.userImgUrl = b.userImgUrl;
        blog.shortText = shortText;
        blog.text = b.text;
        blog.title = b.title;
        blog.image = b.image;
        blog.save(function (err, result) {
            if (!err) {
                var postId = result.id;
                if (typeof postId != 'undefined') {
                    b.postId = postId,
                        out = CONS.getJson(200, "Blog has been created successfully", result);
                }
                else {
                    out = CONS.getJson(100, "There is a problem while creating blog. Please contact system admin", b);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
            }
            res.json(out);
        });
    });

    // //lookup post by userId

    // app.get('/api/users/:id/posts', function (req, res) {
    //     Post.find({ userId: req.params.id }, function (err, rows) {
    //         var out;
    //         if (!err) {
    //             if (rows.length > 0)
    //                 out = CONS.getJson(200, "Success", rows);
    //             else {
    //                 out = CONS.getJson(100, "User doesn't exist. Please check userId", "", rows);
    //             }
    //         }
    //         else {
    //             out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
    //             U.logError("get consumer by id", err, "Internal server error. Please contact system admin", req.params);
    //         }
    //         res.json(out);
    //     });
    // });

    //lookup all blog
    app.get('/api/blogs', function (req, res) {
        Blog.find({}, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "No blog found", "", err);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get all blog", err, "Internal server error. Please contact system admin", req.params);
            }
            res.json(out)
        });
    });



    // //Write comment on a post
    // app.post('/api/posts/comment', function (req, res) {
    //     var b = req.body;
    //     var postComment = new Comment();
    //     postComment.userName = b.userName;
    //     postComment.userId = b.userId;
    //     postComment.postId = b.postId;
    //     postComment.text = b.text;

    //     postComment.save(function (err, result) {
    //         var out;
    //         if (!err) {
    //             var id = result.id;
    //             if (typeof id != 'undefined') {
    //                 b.id = id,
    //                     out = CONS.getJson(200, "you write a comment ", b);
    //             }
    //             else {
    //                 out = CONS.getJson(100, "There is a problem while post a comment. Please contact system admin", b);
    //                 U.logError("comment Post", b, "might be fields are missing", b);
    //             }
    //         }
    //         else {
    //             out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
    //             U.logError("comment Post", err, "Internal server error", b);
    //         }

    //         res.json(out);
    //     });
    // });

    // //lookup post like by postId

    // app.get('/api/posts/:postId/likes', function (req, res) {
    //     Like.find({ postId: req.params.postId }, function (err, rows) {
    //         var out;
    //         if (!err) {
    //             if (rows.length > 0)
    //                 out = CONS.getJson(200, "Success", rows);
    //             else {
    //                 out = CONS.getJson(100, "Like doesn't exist. Please check postId", "", rows);
    //             }
    //         }
    //         else {
    //             out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
    //             U.logError("get like by postId", err, "Internal server error. Please contact system admin", req.params);
    //         }
    //         res.json(out)
    //     });
    // });



    // app.get('/api/posts/:postId', function (req, res) {
    //     Post.find({ "_id": req.params.postId }, function (err, rows) {
    //         var out;
    //         if (!err) {
    //             if (rows.length > 0)
    //                 out = CONS.getJson(200, "Success", rows);
    //             else {
    //                 out = CONS.getJson(100, "Like doesn't exist. Please check postId", "", rows);
    //             }
    //         }
    //         else {
    //             out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
    //             U.logError("get like by postId", err, "Internal server error. Please contact system admin", req.params);
    //         }
    //         res.json(out)
    //     });
    // });


}