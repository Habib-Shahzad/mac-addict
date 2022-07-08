const router = require('express').Router();
// const Order = require('../schema').orders;
const Order = require('../schema/order');
const slugify = require('slugify');

const crypto = require('crypto');


router.get('/table-data', async (req, res) => {
    const orders = await Order.find({})
        .populate('user')
        .populate({
            path: 'orderItems',
            populate: { path: 'brand' }
        })
        .populate({
            path: 'orderItems',
            populate: { path: 'color' }
        })
        .populate({
            path: 'orderItems',
            populate: { path: 'size' }
        })
        .populate({
            path: 'deliveryAddress',
            populate: {
                path: 'city',
                populate: {
                    path: 'province',
                    populate: {
                        path: 'country',
                    }
                }
            }
        }
        )
        ;

    if (!orders) res.json({ data: [] });
    else res.json({ data: orders });
});

router.get('/table-data-auto', async (req, res) => {
    const orders = await Order.find({}).populate('user');
    if (!orders) res.json({ data: [] });
    else res.json({ data: orders });
});

router.get('/get-orders/:userID', async (req, res) => {
    const orders = await Order.find({ user: req.params.userID })
        .populate('user')
        .populate({
            path: 'orderItems',
            populate: { path: 'brand' }
        })
        .populate({
            path: 'orderItems',
            populate: { path: 'color' }
        })
        .populate({
            path: 'orderItems',
            populate: { path: 'size' }
        })
        .populate({
            path: 'deliveryAddress',
            populate: {
                path: 'city',
                populate: {
                    path: 'province',
                    populate: {
                        path: 'country',
                    }
                }
            }
        }
        )
        ;
    if (!orders) res.json({ data: [] });
    else res.json({ data: orders });
});

router.post('/delete', async (req, res) => {
    await Order.deleteMany({ _id: { $in: req.body.data } });
    const orders = await Order.find({});
    res.json({ success: true, data: orders });
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


    let orderNumber = null;
    while (orderNumber === null) {
        let tempOrderNumber = crypto.randomBytes(5).toString('hex');
        const orderExists = await Order.exists({ orderNumber: tempOrderNumber });
        if (!orderExists) orderNumber = tempOrderNumber;
    }

    const order = new Order({
        totalPrice: data.cost,
        orderItems: products,
        deliveryAddress: deliveryAddress,
        paymentMethod: data.paymentMethod,
        user: data.user_id,
        order_status: false,
        orderNumber: orderNumber,
    });

    await order.save();


    res.json({ success: true, data: order });
});


module.exports = router;