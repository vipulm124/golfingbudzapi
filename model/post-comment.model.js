var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var post_comment = mongoose.Schema({

    userName: { type: String, required: true },
    userId: { type: String, required: true },
    postId: String,
    text: String,
    userImgUrl:String

});
post_comment.plugin(timestamps);
module.exports = mongoose.model('post_comment', post_comment);