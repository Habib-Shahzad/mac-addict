const router = require('express').Router();
const Product = require('../schema').product;
const Category = require('../schema').category;
const SubCategory = require('../schema').subCategory;
const FurtherSubCategory = require('../schema').furtherSubCategory;
const ProductDetail = require('../schema').productDetail;
const slugify = require('slugify');


const admin_auth = require('./middleware/admin_auth');

router.get('/table-data', async (req, res) => {
    const products = await Product.find({})
        .populate('category')
        .populate('subCategory')
        .populate('furtherSubCategory')
        .populate('brand')
        .populate({
            path: 'productDetails',
            populate: [
                { path: 'size' },
                { path: 'color' }
            ]
        });
    if (!products) res.json({ data: [] });
    else res.json({ data: products });
});

router.get('/table-data-list', async (req, res) => {
    const products = await Product.find({})
        .populate('category')
        .populate('subCategory')
        .populate('furtherSubCategory')
        .populate('brand');
    if (!products) res.json({ success: false, data: [] });
    else res.json({ success: true, data: products });
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
    const product = await Product.findOne({ slug: 'cool' }, { _id: 0 })
        .populate('furtherSubCategory')
        .populate('brand')
        .populate({
            path: 'productDetails',
            populate: [
                { path: 'size' },
                { path: 'color' }
            ]
        });
    if (!product) res.json({ data: null });
    else res.json({ data: product });
});

router.post('/add', admin_auth, async (req, res) => {
    try {

        const data = req.body;
        let i = 0;
        let slug = '';
        while (true) {
            slug = `${slugify(data.name, { lower: true })}-${i}`;
            const objExists = await Product.exists({ slug: slug });
            if (objExists) i += 1;
            else break;
        }

        const newProduct = new Product({
            name: data.name,
            slug: slug,
            default_image: data.default_image,
            product_description: data.product_description,
            productDetails: data.productDetails,
            active: data.active,
            hasColor: data.hasColor,
            category: data.category,
            subCategory: data.subCategory,
            furtherSubCategory: data.furtherSubCategory,
            brand: data.brand,
            keywords: data.keywords,
            description: data.description,
        });

        await newProduct.save();

        res.json({ success: true, data: newProduct });
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, data: null });
    }
});

router.post('/update', admin_auth, async (req, res) => {
    const data = req.body;
    const product = await Product.findOne({ _id: data._id });

    product.name = data.name;
    product.default_image = data.default_image;
    product.product_description = data.product_description;
    product.productDetails = data.productDetails;
    product.active = data.active;
    product.hasColor = data.hasColor;
    product.category = data.category;
    product.subCategory = data.subCategory;
    product.furtherSubCategory = data.furtherSubCategory;
    product.brand = data.brand;
    product.keywords = data.keywords;
    product.description = data.description;

    await product.save();
    res.json({ data: product });

});


router.get('/get-by-slug/:slug', async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug }).populate('furtherSubCategory').populate('brand').populate({
        path: 'productDetails',
        populate: [
            { path: 'size' },
            { path: 'color' }
        ]
    });
    ;
    if (!product) res.json({ success: false, data: null });
    else res.json({ success: true, data: product });
});


router.post('/delete', admin_auth, async (req, res) => {
    try {
        // const data = req.body.data;
        await Product.deleteMany({ _id: { $in: req.body.data } });
        const products = await Product.find({});
        res.json({ success: true, data: products });

    } catch (error) {
        console.log(error);
        res.json({ success: true, data: [] });
    }
});

router.get('/client-product', async (req, res) => {
    const product = await Product.findOne({ slug: req.query.productSlug, active: true }).populate('brand').populate(
        {
            path: 'productDetails',
            populate: [
                {
                    path: 'size',
                },
                {
                    path: 'color',
                },
            ]
        }
    )
    res.json({ data: product })
});

router.get('/client-all-products', async (req, res) => {
    const size = parseInt(req.query.size);
    const number = size * (parseInt(req.query.page) - 1);
    const subCategory = await SubCategory.findOne({ slug: req.query['sub-category'] });
    let furtherSubCategory = null;
    let products = [];
    if (req.query['further-sub-category'] !== 'undefined') {
        furtherSubCategory = await FurtherSubCategory.findOne({ slug: req.query['further-sub-category'] });
        products = await Product.find({ subCategory: subCategory, furtherSubCategory: furtherSubCategory, active: true }, {}, { skip: number, limit: size }).populate('brand').populate(
            {
                path: 'productDetails'
            }
        ).sort('name');
    } else {
        products = await Product.find({ subCategory: subCategory, active: true }, {}, { skip: number, limit: size }).populate('brand').populate(
            {
                path: 'productDetails'
            }
        ).sort('name');
    }
    res.json({ subCategory: subCategory, furtherSubCategory: furtherSubCategory, products: products });
});

router.get('/total-pages', async (req, res) => {
    const subCategory = await SubCategory.findOne({ slug: req.query['sub-category'] });
    let furtherSubCategory = null;
    const size = parseInt(req.query.size);
    let count = 0;
    if (req.query['further-sub-category'] !== 'undefined') {
        furtherSubCategory = await FurtherSubCategory.findOne({ slug: req.query['further-sub-category'] });
        count = await Product.countDocuments({ subCategory: subCategory, furtherSubCategory: furtherSubCategory, active: true });
    } else {
        count = await Product.countDocuments({ subCategory: subCategory, active: true });
    }
    res.json({ data: Math.ceil(count / size) });
});

router.get('/client-category-products', async (req, res) => {
    const category = await Category.find({ slug: req.query.category });
    const subCategories = await SubCategory.find({ category: category });
    const products = {};
    for (let i = 0; i < subCategories.length; i++) {
        const subCategory = subCategories[i];
        const productsFromCategory = await Product.find({ subCategory: subCategory, active: true }).populate('brand').populate(
            {
                path: 'productDetails'
            }
        ).limit(4);
        products[subCategory.name] = { name: subCategory.name, slug: subCategory.slug, products: productsFromCategory };
    }
    res.json({ data: products })
});



router.post("/set-active", admin_auth, async (req, res) => {
    const { active, selected } = req.body;

    await Product.updateMany({ _id: { $in: selected } }, { active: active });
    const products = await Product.find({});

    if (!products) res.json({ data: [] });
    else res.json({ data: products });

});

module.exports = router;