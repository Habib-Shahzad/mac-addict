const router = require('express').Router();
const Product = require('../schema').product;
const Coupon = require('../schema').coupon;
const Order = require('../schema').order;

require('dotenv').config();

const user_auth = require('./middleware/user_auth');

router.get('/getCart', async (req, res) => {
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

            const coupons = await Coupon.find({});

            let couponFound = false;

            coupons.forEach((coupon) => {

                if (coupon.redeemBy > new Date() && coupon.timesRedeeemed < coupon.maxRedemptions && !couponFound) {
                    if (coupon.appliedToProducts && !coupon.hasPromotionCodes && !couponFound) {
                        couponFound = true;
                        coupon.products.forEach((productObj) => {
                            if (productObj.product_detail.toString() === product_detail._id.toString()) {

                                if (coupon.type === "Percentage") {

                                    product_detail.discountedPrice = product_detail.price - (product_detail.price * (coupon.percentOff / 100));
                                }
                                else if (coupon.type === "Fixed Amount") {
                                    product_detail.discountedPrice = product_detail.price - coupon.amountOff;
                                }
                            }
                        })
                    }
                }
            });

            const product_obj = {
                user_id: user_id,
                name: product.name,
                default_image: product.default_image,
                quantity: cartCookie[key],
                discountedPrice: product_detail.discountedPrice,
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

        const coupons = await Coupon.find({});

        coupons.forEach((coupon) => {
            if (coupon.redeemBy > new Date() && coupon.timesRedeeemed < coupon.maxRedemptions) {
                if (coupon.appliedToProducts && !coupon.hasPromotionCodes) {
                    coupon.products.forEach((productObj) => {
                        if (productObj.product_detail.toString() === product_detail._id.toString()) {
                            if (coupon.type === "Percentage") {
                                product_detail.discountedPrice = product_detail.price - (product_detail.price * (coupon.percentOff / 100));
                            }
                            else if (coupon.type === "Fixed Amount") {
                                product_detail.discountedPrice = product_detail.price - coupon.amountOff;
                            }
                        }
                    })
                }
            }
        });


        const product_obj = {
            user_id: user_id,
            name: product.name,
            default_image: product.default_image,
            quantity: cartCookie[key],
            discountedPrice: product_detail.discountedPrice,
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


router.post('/coupon-check', user_auth, async (req, res) => {

    const { promoCode, user_id, order_cost } = req.body;

    const orders = await Order.find({ user: user_id });

    const cartCookie = req.cookies?.['cart'];
    let cart_products = {};

    let coupon_obj = null;
    let found_promo = false;

    const coupons = await Coupon.find({});

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

        coupons.forEach((coupon) => {
            if (coupon.redeemBy > new Date() && coupon.timesRedeeemed < coupon.maxRedemptions) {
                if (coupon.hasPromotionCodes) {
                    coupon.promotionCodes.forEach((promotionCode) => {
                        let is_valid = true;
                        if (promotionCode.firstTimeTransaction && orders.length !== 0) {
                            is_valid = false;
                        }

                        if (
                            promotionCode.expiresAt > new Date()
                            && promotionCode.code === promoCode
                            && promotionCode.timesRedeeemed < promotionCode.maxRedemptions
                            && promotionCode.active
                            && order_cost >= promotionCode.minAmount
                            && is_valid
                            && !found_promo
                        ) {

                            if (coupon.appliedToProducts) {

                                coupon.products.forEach((productObj) => {
                                    if (productObj.product_detail.toString() === product_detail._id.toString()) {
                                        found_promo = true;
                                        coupon_obj = coupon;
                                        if (coupon.type === "Percentage") {
                                            product_detail.discountedPrice = product_detail.price - (product_detail.price * (coupon.percentOff / 100));
                                        }
                                        else if (coupon.type === "Fixed Amount") {
                                            product_detail.discountedPrice = product_detail.price - coupon.amountOff;
                                        }
                                    }
                                })
                            }
                            else {
                                coupon.products.forEach((productObj) => {
                                    if (productObj.product_detail.toString() === product_detail._id.toString()) {
                                        product_detail.discountedPrice = null;
                                    }
                                })

                                found_promo = true;
                                coupon_obj = coupon;
                            }
                        }
                    });
                }
            }
        });

        const product_obj = {
            user_id: user_id,
            name: product.name,
            default_image: product.default_image,
            quantity: cartCookie[key],
            discountedPrice: product_detail.discountedPrice,
            price: product_detail.price,
            points: product_detail.points,
            size: product_detail.size,
            color: product_detail.color,
            product_id: product_id,
            brand: product.brand,
        };
        cart_products[key] = product_obj;
    }


    if (!found_promo) {
        res.json({ success: false, data: null });
    }

    else if (coupon_obj.appliedToProducts) {
        res.json({
            success: true,
            data: cart_products,
            appliedToProducts: true,
            coupon: {
                _id: coupon_obj._id,
                name: coupon_obj.name,
                amount_off: coupon_obj.amountOff,
                percent_off: coupon_obj.percentOff,
                type: coupon_obj.type,
                appliedToProducts: true,
            }
        });
    }

    else {
        res.json({
            success: true,
            data: cart_products,
            appliedToProducts: false,
            coupon: {
                name: coupon_obj.name,
                amount_off: coupon_obj.amountOff,
                percent_off: coupon_obj.percentOff,
                type: coupon_obj.type,
                appliedToProducts: false
            }
        });
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