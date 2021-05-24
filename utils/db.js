

const mysql = require('mysql');

class Db {
	constructor(config) {
		this.connection = mysql.createPool({
			connectionLimit: 100,
			host: '127.0.0.1',
			port: 3306,
			user: 'root',
			password: '1234',
			database: 'chat_channel',
			debug: false
		});
	}
	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows) => {
				if (err)
					return reject(err);
				resolve(rows);
			});
		});
	}
	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err)
					return reject(err);
				resolve();
			});
		});
	}
}
module.exports = new Db();
