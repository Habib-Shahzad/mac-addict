const router = require('express').Router();
// const Order = require('../schema').orders;
const Order = require('../schema/order');
const slugify = require('slugify');

router.get('/table-data', async (req, res) => {
    const orders = await Order.find({});
    if (!orders) res.json({ data: [] });
    else res.json({ data: orders });
});

router.get('/table-data-auto', async (req, res) => {
    const orders = await Order.find({});
    if (!orders) res.json({ data: [] });
    else res.json({ data: orders });
});


router.post('/add-order', async (req, res) => {
    const data = req.body;

    let deliveryAddress = data.deliveryAddress;
    delete deliveryAddress["_id"];

    let products = [];
    data.products.forEach(product => {
        let productObj = product;
        delete productObj["user_id"];
        delete productObj["default_image"];
        delete productObj["slug"];
        delete productObj["description"];
        products.push(productObj);
    });

    const order = new Order({
        totalPrice: data.cost,
        products: products,
        deliveryAddress: deliveryAddress,
        paymentMethod: data.paymentMethod,
        user: data.user_id,
    });

    await order.save();
    res.json({ success: true, data: order });
});


module.exports = router;