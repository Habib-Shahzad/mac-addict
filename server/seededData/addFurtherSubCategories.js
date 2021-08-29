const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const FurtherSubCategory = require('../schema').furtherSubCategory;
const SubCategory = require('../schema').subCategory;
const slugify = require('slugify');

const furtherSubCategories = require('./furtherSubCategories.json');

const url = process.env.DATABASE_URL;

const createServer = async (callback) => {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database created!");
    // console.log(provinces);
    furtherSubCategories.forEach(async obj => {
        const subCategory = await SubCategory.findOne({ name: obj['Sub Category'] });
        if (subCategory) {
            let i = 0;
            let slug = '';
            while (true) {
                slug = `${slugify(obj.Name, { lower: true })}-${i}`;
                const objExists = await SubCategory.exists({ slug: slug });
                if (objExists) i += 1;
                else break;
            }
            const newFurtherSubCategory = new FurtherSubCategory({
                name: obj.Name,
                slug: slug,
                active: true,
                subCategory: subCategory,
            });
            newFurtherSubCategory.save();
        }
    });
}

createServer();