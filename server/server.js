const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();
const app = express();

const url = process.env.DATABASE_URL;
const port = parseInt(process.env.PORT);

const createServer = async (callback) => {

    console.log("Server Says Hello!");

    mongoose
        .connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        })
        .then(() => {
            console.log("Successfully connected to database", process.env.DATABASE_NAME);
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(cookieParser(
        process.env.COOKIE_SECRET
    ));
    app.use(cors({
        credentials: true,
        origin: [process.env.API_URL1, process.env.API_URL2, process.env.API_URL3, process.env.API_URL4]
    }));

    // app.use(express.static('../client/public'));
    app.use(express.static(path.join(__dirname, '../client/build')));

    const userRoutes = require('./routes/user');
    const cartRoutes = require('./routes/cart');
    const categoryRoutes = require('./routes/category');
    const subCategoryRoutes = require('./routes/subCategory');
    const furtherSubCategoryRoutes = require('./routes/furtherSubCategory');
    const brandRoutes = require('./routes/brand');
    const productRoutes = require('./routes/product');
    const sizeRoutes = require('./routes/size');
    const colorRoutes = require('./routes/color');
    const countryRoutes = require('./routes/country');
    const provinceRoutes = require('./routes/province');
    const cityRoutes = require('./routes/city');
    const orderRoutes = require('./routes/order');
    const discountRoutes = require('./routes/discount');

    app.use('/api/user', userRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/category', categoryRoutes);
    app.use('/api/sub-category', subCategoryRoutes);
    app.use('/api/further-sub-category', furtherSubCategoryRoutes);
    app.use('/api/brand', brandRoutes);
    app.use('/api/product', productRoutes);
    app.use('/api/size', sizeRoutes);
    app.use('/api/color', colorRoutes);
    app.use('/api/country', countryRoutes);
    app.use('/api/province', provinceRoutes);
    app.use('/api/city', cityRoutes);
    app.use('/api/order', orderRoutes);
    app.use('/api/discount', discountRoutes);

    // app.get('*', function (req, res) {
    //     res.sendFile(path.join(__dirname, '../client/build/index.html'));
    // });



    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

createServer();