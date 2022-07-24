const router = require('express').Router();
const Product = require('../schema').product;
const Category = require('../schema').category;
const SubCategory = require('../schema').subCategory;
const FurtherSubCategory = require('../schema').furtherSubCategory;
const Coupon = require('../schema').coupon;
const Brand = require('../schema').brand;
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


const getProductsList = async (products) => {

    const coupons = await Coupon.find({});

    let couponFound = false;

    coupons.forEach((coupon) => {

        if (coupon.redeemBy < new Date() && coupon.timesRedeeemed >= coupon.maxRedemptions) {
            console.log("Coupon invalid");
        }

        else {
            if (coupon.appliedToProducts && !coupon.hasPromotionCodes && !couponFound) {

                coupon.products.forEach((productObj) => {
                    products.forEach((product) => {
                        product.productDetails.forEach((detail) => {
                            if (product._id.toString() === productObj.product.toString()
                                &&
                                detail._id.toString() === productObj.product_detail.toString()
                            ) {
                                couponFound = true;
                                if (coupon.type === "Percentage") {
                                    detail.discountedPrice = detail.price - (detail.price * (coupon.percentOff / 100));
                                }
                                else if (coupon.type === "Fixed Amount") {
                                    detail.discountedPrice = detail.price - coupon.amountOff;
                                }
                            }
                        })
                    })
                })
            }
        }
    });

    return products
}

router.get('/table-data-list', async (req, res) => {
    let products = await Product.find({})
        .populate('category')
        .populate('subCategory')
        .populate('furtherSubCategory')
        .populate('brand');

    const productsList = await getProductsList(products);
    if (!products) res.json({ success: false, data: [] });
    else res.json({ success: true, data: productsList });
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
            hotSeller: data.hotSeller,
            newArrival: data.newArrival,
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
    product.hotSeller = data.hotSeller;
    product.newArrival = data.newArrival;

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

    const coupons = await Coupon.find({});

    coupons.forEach((coupon) => {

        if (coupon.redeemBy < new Date() && coupon.timesRedeeemed >= coupon.maxRedemptions) {
            console.log("Coupon invalid");
        }

        else {
            if (coupon.appliedToProducts && !coupon.hasPromotionCodes) {

                coupon.products.forEach((productObj) => {

                    product.productDetails.forEach((detail) => {

                        if (product._id.toString() === productObj.product.toString()
                            &&
                            detail._id.toString() === productObj.product_detail.toString()
                        ) {
                            if (coupon.type === "Percentage") {
                                detail.discountedPrice = detail.price - (detail.price * (coupon.percentOff / 100));
                            }
                            else if (coupon.type === "Fixed Amount") {
                                detail.discountedPrice = detail.price - coupon.amountOff;
                            }
                        }
                    })
                })
            }
        }
    });


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


router.get('/client-brand-products', async (req, res) => {
    const brand = await Brand.findOne({ slug: req.query.brand });

    let products = await Product.find({ brand: brand })
        .populate('brand')
        .populate(
            {
                path: 'productDetails'
            }
        );

    const productsList = await getProductsList(products);

    res.json({ data: [], productsList: productsList });

});

router.get('/client-category-products', async (req, res) => {
    const category = await Category.find({ slug: req.query.category });
    const subCategories = await SubCategory.find({ category: category });

    let otherProducts = await Product.find({ category: category, subCategory: null })
        .populate('brand')
        .populate(
            {
                path: 'productDetails'
            }
        );

    const otherProductsList = await getProductsList(otherProducts);

    const products = {};
    for (let i = 0; i < subCategories.length; i++) {
        const subCategory = subCategories[i];
        const catProducts = await Product.find({ subCategory: subCategory, active: true }).populate('brand').populate(
            {
                path: 'productDetails'
            }
        ).limit(4);
        const catProductsList = await getProductsList(catProducts);
        products[subCategory.name] = { name: subCategory.name, slug: subCategory.slug, products: catProductsList };
    }
    res.json({ data: products, productsList: otherProductsList });
});




router.get('/client-subCategory-products', async (req, res) => {
    const subCategory = await SubCategory.find({ slug: req.query.subCategory });
    const furtherSubCategories = await FurtherSubCategory.find({ subCategory: subCategory });

    let otherProducts = await Product.find({ subCategory: subCategory, furtherSubCategory: null })
        .populate('brand')
        .populate(
            {
                path: 'productDetails'
            }
        );

    const otherProductsList = await getProductsList(otherProducts);

    const products = {};
    for (let i = 0; i < furtherSubCategories.length; i++) {
        const futherSubCategory = furtherSubCategories[i];
        const catProducts = await Product.find({ furtherSubCategory: futherSubCategory, active: true })
            .populate('brand')
            .populate(
                {
                    path: 'productDetails'
                }
            ).limit(4);

        const catProductsList = await getProductsList(catProducts);

        products[futherSubCategory.name] = { name: futherSubCategory.name, slug: futherSubCategory.slug, products: catProductsList };
    }
    res.json({ data: products, productsList: otherProductsList });
});




router.get('/client-furtherSubCategory-products', async (req, res) => {

    const furtherSubCategory = await FurtherSubCategory.find({ slug: req.query.furtherSubCategory });

    let products = await Product.find({ furtherSubCategory: furtherSubCategory })
        .populate('brand')
        .populate(
            {
                path: 'productDetails'
            }
        );

    const productsList = await getProductsList(products);
    res.json({ productsList: productsList });
});



router.post("/set-active", admin_auth, async (req, res) => {
    const { active, selected } = req.body;

    await Product.updateMany({ _id: { $in: selected } }, { active: active });
    const products = await Product.find({});

    if (!products) res.json({ data: [] });
    else res.json({ data: products });

});

module.exports = router;