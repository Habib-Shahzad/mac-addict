const router = require('express').Router();
const SubCategory = require('../schema').subCategory;
const FurtherSubCategory = require('../schema').furtherSubCategory;
const Product = require('../schema').product;
const slugify = require('slugify');

router.get('/table-data', async (req, res) => {
    const subCategories = await SubCategory.find({}).populate('category');
    if (!subCategories) res.json({ data: [] });
    else res.json({ data: subCategories });
});

router.post('/table-data-auto', async (req, res) => {
    if (Object.keys(req.body).length !== 0) {
        const subCategories = await SubCategory.find({ category: req.body });
        res.json({ data: subCategories });
    } else {
        const subCategories = await SubCategory.find({});
        res.json({ data: subCategories });
    }
});

router.get('/get-sub-categories', async (req, res) => {
    const subCategories = await SubCategory.find({}, { _id: 0 });
    if (!subCategories) res.json({ data: [] });
    else res.json({ data: subCategories });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    let i = 0;
    let slug = '';
    while (true) {
        slug = `${slugify(data.name, { lower: true })}-${i}`;
        const objExists = await SubCategory.exists({ slug: slug });
        if (objExists) i += 1;
        else break;
    }
    const newSubCategory = new SubCategory({
        name: data.name,
        slug: slug,
        active: data.active,
        keywords: data.keywords,
        description: data.description,
        category: data.category,
    });
    newSubCategory.save();
    res.json({ data: newSubCategory });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const subCategory = await SubCategory.findOne({ _id: data._id });
    let slug = '';
    if (subCategory.name === data.name) slug = subCategory.slug;
    else {
        let i = 0;
        while (true) {
            slug = `${slugify(data.name, { lower: true })}-${i}`;
            const objExists = await SubCategory.exists({ slug: slug });
            if (objExists) i += 1;
            else break;
        }
    }
    subCategory.name = data.name;
    subCategory.slug = slug;
    subCategory.keywords = data.keywords;
    subCategory.description = data.description;
    subCategory.category = data.category;
    subCategory.active = data.active;
    subCategory.save();
    res.json({ data: subCategory });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const subCategories = await SubCategory.find({ _id: getIds }).populate({
        path: 'furtherSubCategories',
        populate: {
            path: 'products',
        }
    });
    if (!subCategories) res.json({ data: [] });
    else res.json({ data: subCategories });
});

router.post('/delete', async (req, res) => {
    try {
        const data = req.body.data;
        data.forEach(async subCategory => {
            subCategory.furtherSubCategories.forEach(async furtherSubCategory => {
                await Product.deleteMany({ furtherSubCategory: furtherSubCategory._id });
            });
            await FurtherSubCategory.deleteMany({ subCategory: subCategory._id });
        });
        await SubCategory.deleteMany({ _id: req.body.ids });
        res.json({ data: 'success' });
    } catch (error) {
        console.log(error);
        res.json({ data: 'failed' });
    }
});

module.exports = router;