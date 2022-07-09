const router = require('express').Router();
const Product = require('../schema').product;
require('dotenv').config();


const user_auth = require('./middleware/user_auth');

router.get('/getCart', user_auth, async (req, res) => {
    const cartCookie = req.cookies?.['cart'];
    const cartObj = {}

    if (!cartCookie) {
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate });
        res.json({ data: cartObj });

    } else {
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        res.cookie("cart", cartCookie, { httpOnly: true, maxAge: expiryDate });

        let cart_products = {};

        for (const key in cartCookie) {
            const keys = key.split('-');
            const product_id = keys[0];
            const product_detail_id = keys[1];
            const user_id = keys[2];

            const product = await Product.findOne({ _id: product_id })
                .populate({
                    path: 'productDetails',
                    populate: [
                        { path: 'size' },
                        { path: 'color' }
                    ]
                });

            const product_detail = product.productDetails.find(product_detail => product_detail._id.toString() === product_detail_id);

            const product_obj = {
                user_id: user_id,
                name: product.name,
                default_image: product.default_image,
                quantity: cartCookie[key],
                price: product_detail.price,
                points: product_detail.points,
                size: product_detail.size,
                color: product_detail.color,
                product_id: product_id,
                brand: product.brand,
            };

            cart_products[key] = product_obj;

        }

        res.json({ data: cart_products })
    };
});


router.post('/addToCart', user_auth, async (req, res) => {
    const cartCookie = req.cookies['cart'];

    const { cart_products, product_id, product_detail_id, user_id } = req.body;

    if (cartCookie) {
        const cartObj = cartCookie;

        const key = `${product_id}-${product_detail_id}-${user_id}`;

        if (cartObj[key]) {
            cartObj[key] += 1;
        } else {
            cartObj[key] = 1;
        }

        const expiryDate = new Date(Number(new Date()) + 315360000000);
        res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate });

        const product = await Product.findOne({ _id: product_id })
            .populate({
                path: 'productDetails',
                populate: [
                    { path: 'size' },
                    { path: 'color' }
                ]
            });
        const product_detail = product.productDetails.find(product_detail => product_detail._id.toString() === product_detail_id);

        const product_obj = {
            user_id: user_id,
            name: product.name,
            default_image: product.default_image,
            quantity: cartCookie[key],
            price: product_detail.price,
            points: product_detail.points,
            size: product_detail.size,
            color: product_detail.color,
            product_id: product_id,
            brand: product.brand,
        };
        cart_products[key] = product_obj;

        res.json({ data: cart_products });

    } else {
        res.json({ data: null });
    }
});



router.post('/removeItem', user_auth, async (req, res) => {
    const cartCookie = req.cookies['cart'];
    const { key } = req.query;
    const { cart_products } = req.body;

    if (cartCookie) {
        const cartObj = cartCookie;
        cartObj[key] -= 1;
        cart_products[key].quantity -= 1;

        if (cartObj[key] === 0) {
            delete cartObj[key];
            delete cart_products[key];
        }
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate });
        res.json({ data: cart_products });
    } else {
        res.json({ data: null });
    }

});

router.post('/addItem', user_auth, async (req, res) => {
    const cartCookie = req.cookies['cart'];
    const { key } = req.query;
    const { cart_products } = req.body;
    if (cartCookie) {
        const cartObj = cartCookie;
        cartObj[key] += 1;
        cart_products[key].quantity += 1;
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate });
        res.json({ data: cart_products });
    } else {
        res.json({ data: null });
    }

});


router.post("/clear-cart", user_auth, async (req, res) => {
    const cartCookie = req.cookies['cart'];

    const { user_id, cart_products } = req.body;

    if (cartCookie) {
        const cartObj = cartCookie;
        for (const key in cartCookie) {
            const keys = key.split('-');
            const key_user_id = keys[2];
            if (key_user_id === user_id) {
                delete cartObj[key];
                delete cart_products[key];
            }
        }

        const expiryDate = new Date(Number(new Date()) + 315360000000);
        res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate });
        res.json({ success: true, data: cart_products });
    }
    else {
        res.json({ success: true, data: null });
    }
});


module.exports = router;