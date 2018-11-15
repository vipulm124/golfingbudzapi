var moment = require('moment-timezone');
var FCM = require('fcm-push');
var fcm = require('spire-fcm');
var Notification = require('./../model/notification.model');

exports.getJson = function (code, message, data, error) {
	var out = {};
	out.status = code;
	out.message = message;
	if (data) {
		if (data.constructor === {}.constructor)
			out.data = [data];
		else
			out.data = data;
	}
	else out.data = [{}];
	if (error)
		out.error = error;
	else out.error = {};
	return out;
}

exports.getTime = function () {
	var utc = moment(new Date());
	return utc.tz('Asia/Kolkata').format('YYYY:MM:DD HH:mm:ss');
}

exports.generateAuthToken = function () {
	var length = 30;
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}

exports.sendNotification = function (registrationIds, data) {
	// Create a message
	var message = new fcm.Message();

	// ... or some given values
	var message = new fcm.Message({
		collapseKey: 'GolfingBudz',
		timeToLive: 5,
		notification: data
		//data: data
	});
	// Set up the sender with you API key
	var sender = new fcm.Sender('AAAAQ4qAsKY:APA91bFYOBeuuwr-jE8kaT2YIFpBM1xyg25nLioueDUcHuLszPSvIWLLExvCD1djgLMX66ElEr_80XuRRSTCRcupoGl11EBayPomDdpWUboxajS8_61semOOH3jBWOQ91Bq940LDoht1');
	// ... or retrying a specific number of times (10)
	sender.send(message, registrationIds, 10, function (err, result) {
		if (err) console.error(err);
		else console.log(result);
	});
};

exports.saveNotifecation = function (userName, userId, friendId, userImgUrl, title, type, text, id, requestId, status) {
	var notification = new Notification();
	notification.userName = userName;
	notification.userId = userId;
	notification.friendId = friendId;
	notification.type = type;
	notification.text = text;
	notification.userImgUrl = userImgUrl;
	notification.title = title;
	notification.requestId = requestId;
	notification.id = id;
	notification.status = status;
	notification.save(function (err, result) {
		if (!err) {
			var id = result.id;
			if (typeof id != 'undefined') {
				//	out = getJson(200, "Notification has been sent successfully", result);
			}
			else {
				//	out = getJson(100, "There is a problem while sending notification. Please contact system admin", b);
			}
		}
		else {
			//out = getJson(300, "Internal server error. Please contact system admin", "", err);
		}
	});
};

exports.logError = function (method, error, message, input_data, remarks1, remarks2) {
	if (!remarks2)
		remarks2 = "NA";
	if (!remarks1)
		remarks1 = "NA";
	if (!message)
		message = "NA";
	if (!input_data)
		input_data = "NA";
	if (!error)
		error = "NA";

	console.log("plain error: " + error);
	var errorJson = JSON.stringify(error);
	console.log("error: " + errorJson);
	input_data = JSON.stringify(input_data);
	remarks2 = JSON.stringify(remarks2);
}

exports.updateNotification = function (notificationId) {
	Notification.update(
		{ _id: notificationId },
		{
			$set: {
				status: 'close'
			}
		}
		, function (err, data) {
			if (err) {
				console.log(err);
			} else {
				console.log('successfully');
			}
		});
}