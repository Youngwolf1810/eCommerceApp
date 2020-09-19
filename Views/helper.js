module.exports = {
    getError(errors, prop){
	try {
		return errors.mapped()[prop].msg;
	} catch (error) {
		return '';
    }
}
};