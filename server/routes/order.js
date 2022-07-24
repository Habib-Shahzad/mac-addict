const router = require('express').Router();
const Order = require('../schema/order');
const crypto = require('crypto');

const user_auth = require('./middleware/user_auth');
const admin_auth = require('./middleware/admin_auth');

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


function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const random = Math.floor(Math.random() * 1000);
    return `${year}${month}${day}${hour}${minute}${second}${random}`;
}


router.post('/add-order', user_auth, async (req, res) => {
    const data = req.body;

    let deliveryAddress = data.deliveryAddress;
    delete deliveryAddress["_id"];

    let orderNumber = generateOrderNumber();

    const order = new Order({
        coupon: data.coupon,
        coupon: data.coupon,
        totalPrice: data.cost,
        orderItems: data.products,
        deliveryAddress: deliveryAddress,
        paymentMethod: data.paymentMethod,
        user: data.user_id,
        order_status: false,
        orderNumber: orderNumber,
    });

    await order.save();

    res.json({ success: true, data: order });
});


router.post("/set-complete", admin_auth, async (req, res) => {
    const { completed, selected } = req.body;
    await Order.updateMany({ _id: { $in: selected } }, { orderStatus: completed });

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


module.exports = router;