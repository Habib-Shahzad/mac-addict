const router = require('express').Router();
const Product = require('../schema').product;
const ProductDetail = require('../schema').productDetail;
const slugify = require('slugify');

router.get('/table-data', async (req, res) => {
    const products = await Product.find({}).populate('furtherSubCategory').populate('brand').populate({
        path: 'productDetails',
        populate: [
            { path: 'size' },
            { path: 'color' }
        ]
    });
    if (!products) res.json({ data: [] });
    else res.json({ data: products });
});

router.get('/table-data-auto', async (req, res) => {
    const products = await Product.find({});
    if (!products) res.json({ data: [] });
    else res.json({ data: products });
});

router.get('/get-products', async (req, res) => {
    const products = await Product.find({}, { _id: 0 });
    if (!products) res.json({ data: [] });
    else res.json({ data: products });
});

router.get('/get-product-slug', async (req, res) => {
    const product = await Product.findOne({ slug: 'cool' }, { _id: 0 }).populate('furtherSubCategory').populate('brand').populate({
        path: 'productDetails',
        populate: [
            { path: 'size' },
            { path: 'color' }
        ]
    });
    if (!product) res.json({ data: null });
    else res.json({ data: product });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const productDetails = [];
    data.productDetails.forEach(async productDetail => {
        const newProductDetail = new ProductDetail({
            imagePath: productDetail.imagePath,
            quantity: productDetail.qty,
            price: productDetail.price,
            preOrder: productDetail.preOrder,
            size: productDetail.size,
            color: productDetail.color,
        });
        newProductDetail.save()
        productDetails.push(newProductDetail);
    });
    const newProduct = new Product({
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        keywords: data.keywords,
        description: data.description,
        imagePath: data.imagePath,
        active: data.active,
        hasColor: data.hasColor,
        points: data.points,
        productDetails: productDetails,
        furtherSubCategory: data.furtherSubCategory,
        brand: data.brand,
    });
    newProduct.save();
    res.json({ data: newProduct });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const product = await Product.findOne({ _id: data._id });
    product.name = data.name;
    product.slug = slugify(data.name, { lower: true });
    product.keywords = data.keywords;
    product.description = data.description;
    product.imagePath = data.imagePath;
    product.active = data.active;
    product.points = data.points;
    product.furtherSubCategory = data.furtherSubCategory;
    product.brand = data.brand;
    const oldProductDetails = data.oldProductDetails;
    await ProductDetail.deleteMany({ _id: oldProductDetails });
    const newProductDetails = [];
    data.productDetails.forEach(async productDetail => {
        const newProductDetail = new ProductDetail({
            imagePath: productDetail.imagePath,
            quantity: productDetail.qty,
            price: productDetail.price,
            preOrder: productDetail.preOrder,
            size: productDetail.size,
            color: productDetail.color,
        });
        newProductDetail.save()
        newProductDetails.push(newProductDetail);
    });
    product.productDetails = newProductDetails;
    product.save();
    res.json({ data: 'success' });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const products = await Product.find({ _id: getIds });
    if (!products) res.json({ data: [] });
    else res.json({ data: products });
});

router.post('/delete', async (req, res) => {
    try {
        const data = req.body.data;
        await Product.deleteMany({ _id: req.body.ids });
        res.json({ data: 'success' });
    } catch (error) {
        console.log(error);
        res.json({ data: 'failed' });
    }
});

module.exports = router;