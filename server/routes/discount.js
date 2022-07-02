const router = require('express').Router();
const Discount = require('../schema').discount;

router.get('/table-data', async (req, res) => {
    const discounts = await Discount.find({});
    if (!discounts) res.json({ data: [] });
    else res.json({ data: discounts });
});

router.get('/get-data', async (req, res) => {
    const discounts = [];
    res.json({ data: discounts });
});

router.get('/table-data-auto', async (req, res) => {
    const discounts = await Discount.find({});
    if (!discounts) res.json({ data: [] });
    else res.json({ data: discounts });
});

router.get('/get-discount', async (req, res) => {
    const discounts = await Discount.findOne({}, { '_id': 0 })
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
    res.json({ data: discounts });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    // console.log(data);
    const newDiscount = new Discount({
        name: data.name,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        discountPercentage: data.discountPercentage,
        productDetails: data.productDetails,
    });
    newDiscount.save();
    res.json({ data: newDiscount });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const discount = await Discount.findOne({ _id: data._id });
    discount.name = data.name;
    discount.save();
    res.json({ data: discount });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const discounts = await Discount.find({ _id: getIds });
    if (!discounts) res.json({ data: [] });
    else res.json({ data: discounts });
});

router.post('/delete', async (req, res) => {
    await Discount.deleteMany({ _id: req.body.ids });
    res.json({ data: 'success' });
});

module.exports = router;