const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');

const productRepo = require('../../repositories/products');
const productsNewTemplate = require('../../Views/admin/Products/new');
const productsListTemplate = require('../../Views/admin/Products/index');
const productEditTemplate = require('../../Views/admin/Products/edit');

const { requireTitle, requirePrice } = require('./validators');
const { handleErrors, requireAuth } = require('./middlewares');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
	const products = await productRepo.getAll();

	res.send(productsListTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
	res.send(productsNewTemplate({}));
});

router.post(
	'/admin/products/new',
	requireAuth,
	upload.single('image'),
	[ requireTitle, requirePrice ],
	handleErrors(productsNewTemplate),
	async (req, res) => {
		const imgFile = req.file.buffer.toString('base64');
		const { title, price } = req.body;

		await productRepo.create({ title, price, imgFile });

		res.redirect('/admin/products');
	}
);

router.get('/admin/products/:id/edit', async (req, res) => {
	const product = await productRepo.findById(req.params.id);

	if (!product) return res.send('product not found!!');

	res.send(productEditTemplate({ product }));
});

router.post('/admin/products/:id/edit',requireAuth,
upload.single('image'),
[requireTitle,requirePrice],
handleErrors(productEditTemplate,async req=>{
	const product = await productRepo.findById(req.params.id);

	return {product};
}),
async(req,res)=>{
	const change = req.body;

	if(req.file){
		change.image = req.file.buffer.toString('base64');
	}

	try{
	await productRepo.update(req.params.id,change);
	}
	catch(err){
		res.send('item not found');
	}
	res.redirect('/admin/products');
})

router.post('/admin/products/:id/delete',requireAuth,async (req,res)=>{
	await productRepo.deleteById(req.params.id);

	res.redirect('/admin/products');
})

module.exports = router;
