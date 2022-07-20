const router = require('express').Router();
const Coupon = require('../schema/coupon');


const admin_auth = require('./middleware/admin_auth');


router.get('/table-data', async (req, res) => {
    const coupons = await Coupon.find({})
        .populate({
            path: 'products.product',
            populate: [
                { path: 'productDetails.size' },
                { path: 'productDetails.color' }
            ]
        });
    ;

    // coupons.forEach((coupon) => {

    //     let couponProducts = coupon.products.map((productObj) => {

    //         const productDetailID = productObj.product_detail;
    //         const productDetail = productObj.product.productDetails.find((detail) => {
    //             return detail._id.toString() === productDetailID;
    //         });
    //         return { product: productObj.product, product_detail: productDetail };
    //     })

    //     coupon.products = couponProducts;
    // });

    if (!coupons) res.json({ data: [] });
    else res.json({ data: coupons });
});

router.get('/get-data', async (req, res) => {
    const coupons = [];
    res.json({ data: coupons });
});

router.get('/table-data-auto', async (req, res) => {
    const coupons = await Coupon.find({});
    if (!coupons) res.json({ data: [] });
    else res.json({ data: coupons });
});

router.get('/get-coupon', async (req, res) => {
    const coupons = await Coupon.findOne({}, { '_id': 0 })
        .populate({
            path: 'products',
            select: { '_id': 0 },
            populate: {
                path: 'item',
                select: { 'name': 1, 'slug': 1 }
            }
        })
        .where('startDate').lte(new Date())
        .where('endDate').gte(new Date());
    res.json({ data: coupons });
});

router.post('/add', admin_auth, async (req, res) => {
    const data = req.body;
    const newCoupon = new Coupon({
        name: data.name,
        type: data.type,
        amountOff: data.amountOff,
        percentOff: data.percentOff,
        redeemBy: data.redeemBy,
        maxRedemptions: data.maxRedemptions,
        timesRedeeemed: data.timesRedeeemed,
        appliedToProducts: data.appliedToProducts,
        products: data.products,
        hasPromotionCodes: data.hasPromotionCodes,
        promotionCodes: data.promotionCodes,
    });
    newCoupon.save();
    res.json({ data: newCoupon });
});

router.post('/update', admin_auth, async (req, res) => {
    const data = req.body;
    const coupon = await Coupon.findOne({ _id: data._id });

    coupon.name = data.name;
    coupon.type = data.type;
    coupon.amountOff = data.amountOff;
    coupon.percentOff = data.percentOff;
    coupon.redeemBy = data.redeemBy;
    coupon.maxRedemptions = data.maxRedemptions;
    coupon.timesRedeeemed = data.timesRedeeemed;
    coupon.appliedToProducts = data.appliedToProducts;
    coupon.products = data.products;
    coupon.hasPromotionCodes = data.hasPromotionCodes;
    coupon.promotionCodes = data.promotionCodes;
    coupon.save();
    res.json({ data: coupon });

});


router.post('/delete', admin_auth, async (req, res) => {
    await Coupon.deleteMany({ _id: req.body.ids });
    res.json({ data: 'success' });
});

module.exports = router;