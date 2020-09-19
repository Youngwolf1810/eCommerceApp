const express = require('express');

const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartsShowTemplate = require('../Views/carts/show');

const router = express.Router();

router.post('/cart/products', async (req, res) => {
	let cart;

    console.log(req.session.cartId);

	if (!req.session.cartId) {
		// no cart present...create new cart and store cartId in cookie
		cart = await cartsRepo.create({ items: [] });

		req.session.cartId = cart.id;
	} else {
		// cart already present....find that cart from cartsRepo
		cart = await cartsRepo.findById(req.session.cartId);
	}

    console.log(cart);

	// if existing item increment quantity else add item to cart
	const existingItem = cart.items.find(item => item.id === req.body.productId);

	// console.log(existingItem);

	if (existingItem) {
		// item exists increment quantity  by 1
		existingItem.quantity++;
	} else {
		// item does not exists....add item to cart
		cart.items.push({ id: req.body.productId, quantity: 1 });
	}

	await cartsRepo.update(cart.id, { items: cart.items });

	res.redirect('/');
});

router.get('/cart', async (req, res) => {
	if (!req.session.cartId) return res.redirect('/');

	const cart = await cartsRepo.findById(req.session.cartId);

	for (let item of cart.items) {
		const product = await productsRepo.findById(item.id);

		item.product = product;
	}

	res.send(cartsShowTemplate({ items: cart.items }));
});

router.post('/cart/products/delete',async (req,res)=>{
    console.log(req.body.itemId);

    const{itemId} = req.body;
    
    const cart = await cartsRepo.findById(req.session.cartId);

    const items = cart.items.filter((item)=>{
        return item.id !== itemId;
    })

    await cartsRepo.update(req.session.cartId,{items});
})
module.exports = router;
