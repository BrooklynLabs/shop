module.exports = function(app){
	app.get('/', (req, res)=>{
		res.render('dashboard',req.user);
	})
	app.get('/product', (req, res)=>{
		console.log(req.user.role);
		if(req.user.role=='ADMIN')
			res.render('admin/product',req.user);
		else
			res.render('seller/product',req.user);
	});

	app.get('/product/add', (req, res)=>{
		if(req.user.role=='ADMIN')
			res.render('admin/addProduct',req.user);
		else
			res.render('seller/addProduct',req.user);
	});

	app.get('/product/edit', (req, res)=>{
		if(req.user.role=='ADMIN')
			res.render('admin/editProduct',req.user);
		else
			res.render('seller/editProduct',req.user);
	})

	app.get('/product/:id', (req, res)=>{
		res.send(req.params.id);
	})
}