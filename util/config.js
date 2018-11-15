
var mysql = require('mysql');

//  Read more about mysql connection here : https://www.npmjs.com/package/mysql
module.exports = function handle_database(req, res) {

	var poolDev = mysql.createPool({
		connectionLimit: 100, //important
		host: '162.144.180.63',
		user: 'adcoruwv_golf',
		password: 'golf@123',
		database: 'adcoruwv_golf',
		debug: false
	});

	var pool = mysql.createPool({
		connectionLimit: 10, //important
		host: '103.21.58.244',
		user: 'newprxty_golf',
		password: 'golf@123',
		database: 'newprxty_golfbudz-staging',
		debug: false
	});

	
	switch (process.env.NODE_ENV) {
		case 'development':
			return poolDev;
		case 'development':
			return pool;
		default:
			return poolDev;
	}
}

