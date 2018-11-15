var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var notificationSchema = mongoose.Schema({
    userName: { type: String, default: null },
    userId: { type: String, default: null },
    friendId: { type: String, default: null },
    userImgUrl: { type: String, default: null },
    title: { type: String, default: null },
    type: { type: String, default: null },
    text: { type: String, default: null },
    id: { type: String, default: null },
    status: { type: String, default: 'open' },
    requestId: { type: String, default: 0 }
});
notificationSchema.plugin(timestamps);
module.exports = mongoose.model('notification', notificationSchema);