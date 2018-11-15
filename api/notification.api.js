var U = require('./../util/util');
var Notification = require('./../model/notification.model');
var CONS = require("./../util/const");
var Q = require('q');
module.exports = function (app, pool) {

    app.post('/api/notifications', function (req, res) {
        var out;
        var b = req.body;
        var notification = new Notification();
        notification.userName = b.userName;
        notification.userId = b.userId;
        notification.type = b.type;
        notification.text = b.text;
        notification.userImgUrl = b.userImgUrl;
        notification.title = b.title;
        notification.id = b.id;
        notification.save(function (err, result) {
            if (!err) {
                var id = result.id;
                if (typeof id != 'undefined') {
                    out = CONS.getJson(200, "Notification has been sent successfully", result);
                }
                else {
                    out = CONS.getJson(100, "There is a problem while sending notification. Please contact system admin", b);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
            }
            res.json(out);
        });
    });

    //Get all notiffication of an user
    app.get('/api/users/:id/notifications', function (req, res) {
        Notification.find({ userId: req.params.id, status: 'open' }, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "No notifications found", "", err);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
            }
            res.json(out)
        });
    });
}