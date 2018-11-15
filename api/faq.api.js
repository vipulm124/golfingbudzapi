var U = require('./../util/util');
var Question = require('./../model/faq.model');
var CONS = require("./../util/const");
var Q = require('q');
module.exports = function (app, pool) {

    app.post('/api/questions', function (req, res) {
        var out;
        var b = req.body;
        var faq = new Question();
        faq.title = b.title;
        faq.description = b.description;
        faq.id = b.id;
        faq.save(function (err, result) {
            if (!err) {
                var id = result.id;
                if (typeof id != 'undefined') {
                    out = CONS.getJson(200, "Question added successfully", result);
                }
                else {
                    out = CONS.getJson(100, "There is a problem while adding  question. Please contact system admin", b);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
            }
            res.json(out);
        });
    });

    //get all questions
    app.get('/api/questions', function (req, res) {
        Question.find({}, function (err, rows) {
            var out;
            if (!err) {
                if (rows.length > 0)
                    out = CONS.getJson(200, "Success", rows);
                else {
                    out = CONS.getJson(100, "No question found", "", err);
                }
            }
            else {
                out = CONS.getJson(300, "Internal server error. Please contact system admin", "", err);
                U.logError("get all Question", err, "Internal server error. Please contact system admin", req.params);
            }
            res.json(out)
        });
    });
}