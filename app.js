const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const userRepo = require('./repositories/users');
const authRouter = require('./Routes/admin/auth.js');
const adminProductsRouter = require('./Routes/admin/products.js');
const productsRouter = require('./Routes/products.js');
const cartsRouter = require('./Routes/carts.js');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({
    keys:['ihefihifehhs']
}))

app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
	console.log('listening');
});
