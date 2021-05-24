
'user strict';
const DB = require('./db');
var bcrypt = require('bcrypt');
var mysql = require('mysql');

class Helper {

    constructor(app) {
        this.db = DB;
    }

    async emailCheck(email) {
        return await this.db.query(`SELECT count(email) as count FROM users WHERE LOWER(email) = ?`, `${email}`);
    }

    // async registerUser(params) {
    // 	try {
    // 		return await this.db.query("INSERT INTO users (`username`,`password`,`online`) VALUES (?,?,?)", [params['username'], params['password'], 'Y']);
    // 	} catch (error) {
    // 		console.error(error);
    // 		return null;
    // 	}
    // }


    async loginUser(params) {
        // let user;
        // try{
        //      user = await this.db.query(`SELECT password FROM users WHERE email = ?`, [params.email]);
        // }catch(e){
        //     console.log(e);
        // }

        // let password = user[0].password;
        // password = password.replace(/^\$2y(.+)$/i, '$2a$1');
        // var checkPassword ;
        // bcrypt.compare(params.password, password,function(err,res){
        //     checkPassword = res;
        // })

        try {
            return await this.db.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [params.email, params.password]);
        } catch (error) {
            return null;
        }

    }

    async userSessionCheck(userId) {
        try {
            const result = await this.db.query(`SELECT online,name FROM users WHERE id = ? AND online = ?`, [userId, 'Y']);
            if (result !== null) {
                return result[0]['name'];
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    async addSocketId(userId, userSocketId) {
        try {
            return await this.db.query(`UPDATE users SET socketid = ?, online= ? WHERE id = ?`, [userSocketId, 'Y', userId]);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async isUserLoggedOut(userSocketId) {
        try {
            return await this.db.query(`SELECT online FROM users WHERE socketid = ?`, [userSocketId]);
        } catch (error) {
            return null;
        }
    }

    async logoutUser(userSocketId) {
        return await this.db.query(`UPDATE users SET socketid = ?, online= ? WHERE socketid = ?`, ['', 'N', userSocketId]);
    }

    getChatList(userId, userSocketId) {
        try {
            return Promise.all([
                this.db.query(`SELECT id,name,online,socketid FROM users WHERE id = ?`, [userId]),
                this.db.query(`SELECT id,name,online,socketid FROM users WHERE online = ? and socketid != ?`, ['Y', userSocketId])
            ]).then((response) => {
                return {
                    userinfo: response[0].length > 0 ? response[0][0] : response[0],
                    chatlist: response[1]
                };
            }).catch((error) => {
                console.warn(error);
                return (null);
            });
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    async insertMessages(params) {
        try {
            return await this.db.query(
                "INSERT INTO message (`from_user_id`,`to_user_id`,`message`) values (?,?,?)",
                [params.fromUserId, params.toUserId, params.message]
            );
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    async getMessages(userId, toUserId) {
        try {
            return await this.db.query(
                `SELECT id,from_user_id as fromUserId,to_user_id as toUserId,message FROM message WHERE
					(from_user_id = ? AND to_user_id = ? )
					OR
					(from_user_id = ? AND to_user_id = ? )	ORDER BY id ASC
				`,
                [userId, toUserId, toUserId, userId]
            );
        } catch (error) {
            console.warn(error);
            return null;
        }
    }
}
module.exports = new Helper();
