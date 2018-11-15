var timestamps = require('mongoose-timestamp');
var mongoosePaginate = require('mongoose-paginate');
var mongoose = require('mongoose');
var postschema = mongoose.Schema({
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    userImgUrl: String,
    shortText: String,
    text: String,
    image: String,
    video: String,
    postType: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    thumbUrl: { type: String, default: "" },
    likes: []
});
postschema.plugin(mongoosePaginate);
postschema.plugin(timestamps);
module.exports = mongoose.model('post', postschema);