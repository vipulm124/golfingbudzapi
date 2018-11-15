var moment = require('moment-timezone');
var Q = require('q');
var FCM = require('fcm-push');
var fcm = require('spire-fcm');
var Notification = require('./../model/notification.model');
var request = require("request");
var pool = require('./config')();

module.exports = {

	getConnection: function (pool) {
		var deferred = Q.defer();
		pool.getConnection(function (err, con) {
			if (!err)
				deferred.resolve(con);
			else deferred.reject(err);
		});
		return deferred.promise;
	}
}

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

exports.getTime = function () {
	var utc = moment(new Date());
	return utc.tz('Asia/Kolkata').format('YYYY:MM:DD HH:mm:ss');
}
var getTime = function () {
	var utc = moment(new Date());
	return utc.tz('Asia/Kolkata').format('YYYY:MM:DD HH:mm:ss');
}
exports.getRandomString = function () {
	var length = 16;
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}

exports.getTransactionId = function () {
	var length = 10;
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return "TR" + result;
}



exports.getOTP = function () {
	var length = 4;
	var chars = '0123456789';
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
	});
	// Set up the sender with you API key
	var sender = new fcm.Sender('AAAAEX21O-s:APA91bFbJpsFXNnsKVPfRBus52KRDWnX9sZTCPYs_BzVhG-OWlNiR1z8R5U2rdSGf7FuP7v4cawnEnKgTtHCWN--kAYHiXi8fPOaRd85ZBs4EmBH_zP-c0aTSJRLSb6azuZogRZ7R3DITtV-Y7lkpU0JIx9-zDC47A');
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



exports.verifyUserSocialUser = function (con, email, socialToken) {
	var deferred = Q.defer();
	if (con == null || email == null || socialToken == null) {
		deferred.reject(getJson(100, "Input paramters are not correct", email, socialToken));
	}
	con.query("select userId,isActive from  tbl_loginDetails where userName=? AND socialToken=?",
		[email, socialToken],
		function (err, rows) {
			if (!err) {
				if (rows.length == 0) {
					out = getJson(404, "Sorry, you are not register with us.");
					console.log(out);
					deferred.resolve(out);
				}
				else {
					//check if the current user is active
					if (rows[0].isActive == 1) {
						deferred.resolve(rows[0]);
					}
					else {
						out = getJson(404, "User is blocked. Please contact system administrator.");
						console.log(out);
						deferred.reject(out);
					}
				}
			}
			else {
				out = getJson(300, "Internal server error. Please contact system admin", "", err);
				logError("Verify user", err, "Unable to verify user details");
				deferred.reject(out);
			}
		});
	return deferred.promise;
}
