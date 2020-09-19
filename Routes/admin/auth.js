const express = require('express');
const { check, validationResult } = require('express-validator');

const {
	requireEmail,
	requirePassword,
	requireConfirmPassword,
	requireEmailExists,
	requireValidPasswordForUser
} = require('./validators');
const userRepo = require('../../repositories/users.js');
const signInUtility = require('../../Views/admin/auth/signIn.js');
const signUpUtility = require('../../Views/admin/auth/signUp.js');
const signIn = require('../../Views/admin/auth/signIn.js');
const { handleErrors } = require('./middlewares');

const Router = express.Router();

Router.get('/signup', (req, res) => {
	res.send(signUpUtility({ req }));
});

Router.post(
	'/signup',
	[ requireEmail, requirePassword, requireConfirmPassword ],
	handleErrors(signInUtility),
	async (req, res) => {
		const { email, password, confirmPassword } = req.body;

		const newUser = await userRepo.create({ email, password });

		req.session.userId = newUser.id;

		res.redirect('/admin/products');
	}
);

Router.get('/signin', (req, res) => {
	res.send(signInUtility({}));
});

Router.post(
	'/signin',
	[ requireEmailExists, requireValidPasswordForUser ],
	handleErrors(signInUtility),
	async (req, res) => {
		const { email } = req.body;

		const user = await userRepo.getByOne({ email });

		req.session.userId = user.id;

		res.redirect('/admin/products');
	}
);

Router.get('/signout', (req, res) => {
	req.session = null;
	res.send('Signed Out');
});

module.exports = Router;
