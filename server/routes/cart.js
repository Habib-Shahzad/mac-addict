const router = require('express').Router();
const Product = require('../schema').product;

const dotenv = require('dotenv');
dotenv.config();


router.get('/getCart', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    const cartObj = {}

    if (!cartCookie) {
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate });
        res.json({ data: cartObj });
    } else {
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        await res.cookie("cart", cartCookie, { httpOnly: true, maxAge: expiryDate });
        res.json({ data: cartCookie })
    };
});

router.post('/addToCart', async (req, res) => {
    const cartCookie = req.cookies['cart'];

    if (cartCookie) {
        const cartObj = cartCookie;

        let key = `${req.body.productSlug}-.-.-${req.body.size.name}-.-.-${req.body.color.name}-.-.-${req.body.user_id}`;

        if (cartObj[key]) {
            cartObj[key].quantity += 1;
        } else {
            cartObj[key] = {
                user_id: req.body.user_id,
                images: req.body.imageList,
                product_id: req.body.product_id,
                name: req.body.name,
                slug: req.body.productSlug,
                description: req.body.description,
                brand: req.body.brand,
                hasColor: req.body.hasColor,
                size: req.body.size,
                quantity: 1,
                color: req.body.color,
                price: req.body.price,
                points: req.body.points,
                preOrder: req.body.preOrder,

            }
        }
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate });
        res.json({ data: cartObj });

    } else {
        res.json({ data: null });
    }


});



router.get('/removeItem', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    const { key } = req.query;
    if (cartCookie) {
        const cartObj = cartCookie;
        cartObj[key].quantity -= 1;
        if (cartObj[key].quantity === 0) {
            delete cartObj[key];
        }
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate });
        res.json({ data: cartObj });
    } else {
        res.json({ data: null });
    }

});

router.get('/addItem', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    const { key } = req.query;
    if (cartCookie) {
        const cartObj = cartCookie;
        cartObj[key].quantity += 1;
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate });
        res.json({ data: cartObj });
    } else {
        res.json({ data: null });
    }

});


module.exports = router;