var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var blogschema = mongoose.Schema({
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    userImgUrl: { type: String, required: true },
    shortText: String,
    title: String,
    text: String,
    image: { type: String, default: "" }
});
blogschema.plugin(timestamps);
module.exports = mongoose.model('blog', blogschema);