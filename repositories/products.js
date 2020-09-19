const Repository = require('./repository');

class productsRepository extends Repository {}

module.exports = new productsRepository('products.json');
