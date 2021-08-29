const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Brand = require('../schema').brand;
const slugify = require('slugify');

const brands = require('./brands.json');

const url = process.env.DATABASE_URL;

const createServer = async (callback) => {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database created!");
    // console.log(provinces);
    brands.forEach(async obj => {
        let i = 0;
        let slug = '';
        while (true) {
            slug = `${slugify(obj.Name, { lower: true })}-${i}`;
            const objExists = await Brand.exists({ slug: slug });
            if (objExists) i += 1;
            else break;
        }
        const newBrand = new Brand({
            name: obj.Name,
            slug: slug,
            active: true,
        });
        newBrand.save();
    });
}

createServer();