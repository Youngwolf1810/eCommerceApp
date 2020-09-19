const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(template,cbData) {
		return async(req, res, next) => {
			const errors = validationResult(req);

			let data;
			if (!errors.isEmpty()) {
				if(cbData){
					data = await cbData(req);
				}
				return res.send(template({ ...data,errors }));
			}

			next();
		};
    },
    
    requireAuth(req,res,next){
        if(!req.session.userId){
            return res.redirect('/signin')
        }

        next();
    }
};
