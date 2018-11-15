var U = require('./../util/util');
var Event = require('./../model/event-model');
var EventLike = require('./../model/event-like.model');
var EventAttendees = require('./../model/event-attendees.model');
var CONS = require("./../util/const");
var Q = require('q');
module.exports = function (app, pool) {

    app.post('/api/events', function (req, res) {
        var b = req.body;
        var event = new Event();
        event.userName = b.userName;
        event.userId = b.userId;
        event.title = b.title;
        event.description = b.description;
        event.date = b.date;
        event.time = b.time;
        event.image = b.image;
        event.video = b.video;

        event.save(function (err, result) {
            var out;
            if (!err) {
                var postId = result.id;
                if (typeof postId != 'undefined') {
                    b.postId = postId,
                        out = CONS.getJson(200, "Event has been created successfully", b);
                }
                else {
                    out = CONS.getJson(100, "There is a problem while adding created. Please contact system admin", b);
                    U.logError("add Event", b, "might be fields are missing", b);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("add Post", err, "Internal server error", b);
            }

            res.json(out);
        });
    });


    // app.post('/api/events/like', function (req, res) {
    //     var out;
    //     var b = req.body;

    //     var eventLike = new EventLike();
    //     eventLike.userName = b.userName;
    //     eventLike.userId = b.userId;
    //     eventLike.eventId = b.eventId;
    //     eventLike.save(function (err, result) {
    //         if (!err) {
    //             var postId = result.id;
    //             if (typeof postId != 'undefined') {
    //                 out = CONS.getJson(200, "You liked this event");
    //             }
    //             else {
    //                 out = CONS.getJson(100, "There is a problem while liking event. Please contact system admin", b);
    //             }
    //         }
    //         else {
    //             out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
    //         }

    //         res.json(out);
    //     });
    // });

    //lookup all event
    app.get('/api/events', function (req, res) {
        Event.find({}, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "No event found", "", err);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get all event", err, "Internal server error. Please contact system admin", req.params);
            }
            res.json(out)
        });
    });

    //lookup all event by userId
    app.get('/api/events/:userId', function (req, res) {
        Event.find({}, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "No event found", "", err);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get all event", err, "Internal server error. Please contact system admin", req.params);
            }
            res.json(out)
        });
    });


    //Update event by Id
    app.put('/api/events/:id', function (req, res) {
        var out;
        var b = req.body;
        Event.update({ _id: req.params.id },
            {
                $set: {
                    userName: b.userName,
                    userId: b.userId,
                    date: b.date,
                    image: b.image,
                    time: b.time,
                    video: b.video,
                    description: b.description,
                    title: b.title,
                }
            },
            function (err, result) {
                if (!err) {
                    console.log("result", result.ok);
                    var ok = result.ok;
                    if (result.ok == 1) {
                        out = CONS.getJson(200, "Event update successfully", "");
                        res.json(out);
                    } else {
                        out = CONS.getJson(100, "There is a problem occured when trying to update event", "", err);
                        res.json(out);
                    }
                } else {
                    out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                    res.json(out);
                }
            });
    });

    //lookup post like by postId

    app.get('/api/events/:Id', function (req, res) {
        Event.find({ _id: req.params.Id }, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "Event doesn't exist. Please check Id", "", err);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get Event by Id", err, "Internal server error. Please contact system admin", req.params);
            }
            res.json(out)
        });
    });

    //lookup post comment by postId

    app.get('/api/post/comment:postId', function (req, res) {
        Comment.find({ postId: req.params.postId }, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "Comment doesn't exist. Please check postId", "", rows);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get Comment by postId", err, "Internal server error. Please contact system admin", req.params);
            }
            res.json(out)
        });
    });
    //Event attendees
    app.post('/api/events/attendees', function (req, res) {
        var b = req.body;
        var out;
        var eventAttendees = new EventAttendees();
        eventAttendees.userName = b.userName;
        eventAttendees.userId = b.userId;
        eventAttendees.eventId = b.eventId;
        EventAttendees.find({ eventId: b.eventId, userId: b.userId }, function (err, result) {
            if (!err) {
                if (result.length > 0) {
                    checkUserIdEvent(req.body.eventId, req.body.userId);
                    out = CONS.getJson(200, "success");
                    res.json(out);
                } else {
                    eventAttendees.save(function (err, result) {
                        var out;
                        if (!err) {
                            var postId = result.id;
                            if (typeof postId != 'undefined') {
                                out = CONS.getJson(200, "You are going to attend this event");
                                res.json(out);
                            }
                            else {
                                out = CONS.getJson(100, "There is a problem while attend  event. Please contact system admin", b);
                                res.json(out);
                            }
                        }
                        else {
                            out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                            res.json(out);
                        }
                    });
                }
            } else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                res.json(out);
            }
        });
    });


    //Check userId in likes array
    app.post('/api/events/like', function (req, res) {
        var out;
        var b = req.body;
        var checkUserId = function () {
            var deferred = Q.defer();
            Event.find({
                _id: req.body.eventId,
                likes: { $in: [req.body.userId] }
            },
                function (err, result) {
                    if (!err) {
                        if (result.length > 0) {
                            out = CONS.getJson(200, "You liked it");
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

        var likeEvent = function () {
            var deferred = Q.defer();
            Event.update({ _id: req.body.eventId }, { $push: { likes: req.body.userId } },
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
            Event.update({ _id: req.body.eventId }, { $inc: { likeCount: 1 } },
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
        var saveLikeData = function (out) {
            var deferred = Q.defer();
            var eventLike = new EventLike();
            eventLike.userName = b.userName;
            eventLike.userId = b.userId;
            eventLike.eventId = b.eventId;
            eventLike.save(function (err, result) {
                if (!err) {
                    var postId = result.id;
                    if (typeof postId != 'undefined') {
                        deferred.resolve(out);
                    }
                    else {
                        out = CONS.getJson(100, "There is a problem while liking event. Please contact system admin", b);
                    }
                }
                else {
                    deferred.reject(err);
                }
            });
            return deferred.promise;
        };
        checkUserId()
            .then(function () {
                return likeEvent();
            })
            .then(function (out) {
                return increaseLikeCount(out);
            })
            .then(function (out) {
                return saveLikeData(out);
            })
            .then(function (out) {
                res.json(out);
            })
            .fail(function (e) {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", e);
                res.json(out);
            })
    });

    var checkUserIdEvent = function (eventId, userId) {
        Event.update({ _id: eventId }, { $pull: { eventsAttendess: userId } },
            function (err, data) {
                if (!err) {
                    console.log("success");
                } else {
                    console.log("an error occurred");
                }
            });
    };

    //Get all events
    app.get('/api/events', function (req, res) {
        Event.find({}, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "Events  doesn't exist. Please contact system admin");
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get All events", err, "Internal server error. Please contact system admin", req.params);
            }
            res.json(out)
        });
    });
}