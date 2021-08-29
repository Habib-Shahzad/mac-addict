const router = require('express').Router();
const Category = require('../schema').category;
const SubCategory = require('../schema').subCategory;
const FurtherSubCategory = require('../schema').furtherSubCategory;
const Product = require('../schema').product;
const slugify = require('slugify');

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

router.post('/add', async (req, res) => {
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

router.post('/update', async (req, res) => {
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

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const categories = await Category.find({ _id: getIds }).populate({
        path: 'subCategories',
        populate: {
            path: 'furtherSubCategories',
            populate: {
                path: 'products',
            }
        }
    });
    if (!categories) res.json({ data: [] });
    else res.json({ data: categories });
});

router.post('/delete', async (req, res) => {
    try {
        const data = req.body.data;
        data.forEach(async category => {
            category.subCategories.forEach(async subCategory => {
                subCategory.furtherSubCategories.forEach(async furtherSubCategory => {
                    await Product.deleteMany({ furtherSubCategory: furtherSubCategory._id });
                })
                await FurtherSubCategory.deleteMany({ subCategory: subCategory._id });
            });
            await SubCategory.deleteMany({ category: category._id });
        });
        await Category.deleteMany({ _id: req.body.ids });
        res.json({ data: 'success' });
    } catch (error) {
        console.log(error);
        res.json({ data: 'failed' });
    }
});

module.exports = router;