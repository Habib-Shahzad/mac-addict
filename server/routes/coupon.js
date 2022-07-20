const router = require('express').Router();
const Coupon = require('../schema').coupon;


const admin_auth = require('./middleware/admin_auth');


router.get('/table-data', async (req, res) => {
    const coupons = await Coupon.find({});
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
    // console.log(data);
    const newcoupon = new Coupon({
        name: data.name,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        couponPercentage: data.couponPercentage,
        productDetails: data.productDetails,
    });
    newCoupon.save();
    res.json({ data: newcoupon });
});

router.post('/update', admin_auth, async (req, res) => {
    const data = req.body;
    const coupon = await Coupon.findOne({ _id: data._id });
    Coupon.name = data.name;
    Coupon.save();
    res.json({ data: coupon });
});


router.post('/delete', admin_auth, async (req, res) => {
    await Coupon.deleteMany({ _id: req.body.ids });
    res.json({ data: 'success' });
});

module.exports = router;