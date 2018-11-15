var U = require('./../util/util');
var Contact = require('./../model/contactus.model');
var Q = require('q');
var CONS = require("./../util/const");
module.exports = function (app, pool) {

    app.post('/api/contactus', function (req, res) {
        var out;
        var b = req.body;
        var contact = new Contact();
        contact.userName = b.userName;
        contact.userId = b.userId;
        contact.title = b.title;
        contact.message = b.message;
        contact.email = b.email;
        contact.save(function (err, result) {
            if (!err) {
                var id = result.id;
                if (typeof id != 'undefined') {
                    out = CONS.getJson(200, "Success", result._doc);
                }
                else {
                    out = CONS.getJson(100, "There is a problem while contact us. Please contact system admin", b);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
            }
            res.json(out);
        });
    });

        
}