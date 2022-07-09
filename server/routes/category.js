const router = require('express').Router();
const Category = require('../schema').category;
const SubCategory = require('../schema').subCategory;
const FurtherSubCategory = require('../schema').furtherSubCategory;
const Product = require('../schema').product;
const slugify = require('slugify');


const admin_auth = require('./middleware/admin_auth');


router.get('/table-data', async (req, res) => {
    const categories = await Category.find({});
    if (!categories) res.json({ data: [] });
    else res.json({ data: categories });
});

router.get('/table-data-auto', async (req, res) => {
    const categories = await Category.find({});
    if (!categories) res.json({ data: [] });
    else res.json({ data: categories });
});

router.get('/client-categories', async (req, res) => {
    const categories = await Category.find({}).populate({
        path: 'subCategories',
        populate: {
            path: 'furtherSubCategories'
        }
    });
    if (!categories) res.json({ data: [] });
    else res.json({ data: categories });
});

router.post('/add', admin_auth, async (req, res) => {
    const data = req.body;
    let i = 0;
    let slug = '';
    while (true) {
        slug = `${slugify(data.name, { lower: true })}-${i}`;
        const objExists = await Category.exists({ slug: slug });
        if (objExists) i += 1;
        else break;
    }
    const newCategory = new Category({
        name: data.name,
        slug: slug,
        active: data.active,
        keywords: data.keywords,
        description: data.description,
    });
    newCategory.save();
    res.json({ data: newCategory });
});

router.post('/update', admin_auth, async (req, res) => {
    const data = req.body;
    const category = await Category.findOne({ _id: data._id });
    let slug = '';
    if (category.name === data.name) slug = category.slug;
    else {
        let i = 0;
        while (true) {
            slug = `${slugify(data.name, { lower: true })}-${i}`;
            const objExists = await Category.exists({ slug: slug });
            if (objExists) i += 1;
            else break;
        }
    }
    category.name = data.name;
    category.slug = slug;
    category.keywords = data.keywords;
    category.description = data.description;
    category.active = data.active;
    category.save();
    res.json({ data: category });
});


router.post('/delete', admin_auth, async (req, res) => {
    await Category.deleteMany({ _id: { $in: req.body.data } });
    const subCategories = await SubCategory.find({ category: { $in: req.body.data } });
    await FurtherSubCategory.deleteMany({ subCategory: { $in: subCategories.map(x => x._id) } });
    await SubCategory.deleteMany({ category: { $in: req.body.data } });

    const categories = await Category.find({});
    res.json({ success: true, data: categories });
});

router.post("/set-active", admin_auth, async (req, res) => {
    const { active, selected } = req.body;

    await Category.updateMany({ _id: { $in: selected } }, { active: active });
    const categories = await Category.find({});

    if (!categories) res.json({ data: [] });
    else res.json({ data: categories });

});



module.exports = router;