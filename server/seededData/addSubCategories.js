const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const SubCategory = require('../schema').subCategory;
const Category = require('../schema').category;
const slugify = require('slugify');

const subCategories = require('./subCategories.json');

const url = process.env.DATABASE_URL;

const createServer = async (callback) => {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database created!");
    // console.log(provinces);
    subCategories.forEach(async obj => {
        const category = await Category.findOne({ name: obj.Category });
        if (category) {
            let i = 0;
            let slug = '';
            while (true) {
                slug = `${slugify(obj.Name, { lower: true })}-${i}`;
                const objExists = await SubCategory.exists({ slug: slug });
                if (objExists) i += 1;
                else break;
            }
            const newSubCategory = new SubCategory({
                name: obj.Name,
                slug: slug,
                active: true,
                category: category,
            });
            newSubCategory.save();
        }
    });
}

createServer();