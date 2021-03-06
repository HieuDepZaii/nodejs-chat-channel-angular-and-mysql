
'use strict';

const helper = require('./helper');
const path = require('path');
class Routes {

	constructor(app) {

		this.app = app;
	}

	appRoutes() {
		this.app.post('/emailCheck', async (request, response) => {
			const email = request.body.email;
			if (email === "" || email === undefined || email === null) {
				response.status(412).json({
					error: true,
					message: `email cant be empty.`
				});
			} else {
				const data = await helper.emailCheck(email.toLowerCase());
				if (data[0]['count'] > 0) {
					response.status(401).json({
						error: true,
						message: 'This email is alreday taken.'
					});
				} else {
					response.status(200).json({
						error: false,
						message: 'This email is available.'
					});
				}
			}
		});

		// this.app.post('/registerUser', async (request, response) => {
		// 	const registrationResponse = {}
		// 	const data = {
		// 		username: (request.body.username).toLowerCase(),
		// 		password: request.body.password
		// 	};
		// 	if (data.username === '') {
		// 		registrationResponse.error = true;
		// 		registrationResponse.message = `email cant be empty.`;
		// 		response.status(412).json(registrationResponse);
		// 	} else if (data.password === '') {
		// 		registrationResponse.error = true;
		// 		registrationResponse.message = `password cant be empty.`;
		// 		response.status(412).json(registrationResponse);
		// 	} else {
		// 		const result = await helper.registerUser(data);
		// 		if (result === null) {
		// 			registrationResponse.error = true;
		// 			registrationResponse.message = `User registration unsuccessful,try after some time.`;
		// 			response.status(417).json(registrationResponse);
		// 		} else {
		// 			registrationResponse.error = false;
		// 			registrationResponse.userId = result.insertId;
		// 			registrationResponse.message = `User registration successful.`;
		// 			response.status(200).json(registrationResponse);
		// 		}
		// 	}
		// });

		this.app.post('/login', async (request, response) => {
			const loginResponse = {}
			const data = {
				email: (request.body.email).toLowerCase(),
				password: request.body.password
			};
			if (data.email === '' || data.email === null) {
				loginResponse.error = true;
				loginResponse.message = `email cant be empty.`;
				response.status(412).json(loginResponse);
			} else if (data.password === '' || data.password === null) {
				loginResponse.error = true;
				loginResponse.message = `password cant be empty.`;
				response.status(412).json(loginResponse);
			} else {
				const result = await helper.loginUser(data);
				if (result === null || result.length === 0) {
					loginResponse.error = true;
					loginResponse.message = `Invalid email and password combination.`;
					response.status(401).json(loginResponse);
				} else {
					loginResponse.error = false;
					loginResponse.userId = result[0].id;
					loginResponse.message = `User logged in.`;
					response.status(200).json(loginResponse);
				}
			}
		});

		this.app.post('/userSessionCheck', async (request, response) => {
			const userId = request.body.userId;
			const sessionCheckResponse = {}
			if (userId == '') {
				sessionCheckResponse.error = true;
				sessionCheckResponse.message = `User Id cant be empty.`;
				response.status(412).json(sessionCheckResponse);
			} else {
				const name = await helper.userSessionCheck(userId);
				if (name === null || name === '') {
					sessionCheckResponse.error = true;
					sessionCheckResponse.message = `User is not logged in.`;
					response.status(401).json(sessionCheckResponse);
				} else {
					sessionCheckResponse.error = false;
					sessionCheckResponse.name = name;
					sessionCheckResponse.message = `User logged in.`;
					response.status(200).json(sessionCheckResponse);
				}
			}
		});

		this.app.post('/getMessages', async (request, response) => {
			const userId = request.body.userId;
			const toUserId = request.body.toUserId;
			const messages = {}
			if (userId === '') {
				messages.error = true;
				messages.message = `userId cant be empty.`;
				response.status(200).json(messages);
			} else {
				const result = await helper.getMessages(userId, toUserId);
				if (result === null) {
					messages.error = true;
					messages.message = `Internal Server error.`;
					response.status(500).json(messages);
				} else {
					messages.error = false;
					messages.messages = result;
					response.status(200).json(messages);
				}
			}
		});

		this.app.get('*', (request, response) => {
			response.sendFile(path.join(__dirname + '../../client/views/index.html'));

		});
	}

	routesConfig() {
		this.appRoutes();
	}
}
module.exports = Routes;
