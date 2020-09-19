const { check } = require('express-validator');
const userRepo = require('../../repositories/users');

module.exports = {

	requireTitle: check('title')
				  .trim().isLength({min:5,max:40})
				  .withMessage('Must be between 5 and 40 characters!!'),
	
	requirePrice: check('price').trim()
					.toFloat().isFloat({min:1})
					.withMessage('price must be greater than 1!!'),
					
	requireEmail: check('email').trim().normalizeEmail()
				.isEmail().custom(async (email) => {
				const existingUser = await userRepo.getByOne({ email });

				if (existingUser) {
					throw new Error('Email already exists');
				}
				}),

	requirePassword: check('password').trim()
					.isLength({ min: 4, max: 20 })
					.withMessage('password must be min 4 and max 20 characters long'),

	requireConfirmPassword: check('confirmPassword')
							.trim()
							.isLength({ min: 4, max: 20 })
							.withMessage('password must be min 4 and max 20 characters long')
							.custom((confirmPassword, { req }) => {
								if (req.body.password !== confirmPassword) {
									throw new Error('Passwords do not match!!');
								}
								return true;
							}),

	requireEmailExists: check('email').trim().normalizeEmail().isEmail()
						.withMessage('Email does not exists')
						.custom(async (email) => {
							const user = await userRepo.getByOne({ email });

							if (!user) throw new Error('user not found!!');
						}),
	requireValidPasswordForUser: check('password').trim()
								.custom( async (password,{req})=>{

									const user = await userRepo.getByOne({email:req.body.email});

									if(!user) throw new Error('invalid password');

									const validateUser = await userRepo.comparePasswords(user.password, password);

									if (!validateUser) {
										throw new Error('Invalid password');										
									}
								})

};

