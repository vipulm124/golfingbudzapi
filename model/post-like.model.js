var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var post_like = mongoose.Schema({

    userName: { type: String, required: true },
    userId: { type: String, required: true },
    postId: String

});
post_like.plugin(timestamps);
module.exports = mongoose.model('post_like', post_like);