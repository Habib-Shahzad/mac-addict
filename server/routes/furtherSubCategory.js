const router = require('express').Router();
const FurtherSubCategory = require('../schema').furtherSubCategory;
const Product = require('../schema').product;
const slugify = require('slugify');

router.get('/table-data', async (req, res) => {
    const furtherSubCategories = await FurtherSubCategory.find({}).populate({
        path: 'subCategory',
        populate: {
            path: 'category'
        }
    });
    if (!furtherSubCategories) res.json({ data: [] });
    else res.json({ data: furtherSubCategories });
});

router.post('/table-data-auto', async (req, res) => {
    if (Object.keys(req.body).length !== 0) {
        const furtherSubCategories = await FurtherSubCategory.find({ subCategory: req.body });
        res.json({ data: furtherSubCategories });
    } else {
        const furtherSubCategories = await FurtherSubCategory.find({});
        res.json({ data: furtherSubCategories });
    }
});

router.get('/get-further-sub-categories', async (req, res) => {
    const furtherSubCategories = await FurtherSubCategory.find({}, { _id: 0 });
    if (!furtherSubCategories) res.json({ data: [] });
    else res.json({ data: furtherSubCategories });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    let i = 0;
    let slug = '';
    while (true) {
        slug = `${slugify(data.name, { lower: true })}-${i}`;
        const objExists = await FurtherSubCategory.exists({ slug: slug });
        if (objExists) i += 1;
        else break;
    }
    const newFurtherSubCategory = new FurtherSubCategory({
        name: data.name,
        slug: slug,
        active: data.active,
        keywords: data.keywords,
        description: data.description,
        subCategory: data.subCategory,
    });
    newFurtherSubCategory.save();
    res.json({ data: newFurtherSubCategory });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const furtherSubCategory = await FurtherSubCategory.findOne({ _id: data._id });
    let slug = '';
    if (furtherSubCategory.name === data.name) slug = furtherSubCategory.slug;
    else {
        let i = 0;
        while (true) {
            slug = `${slugify(data.name, { lower: true })}-${i}`;
            const objExists = await FurtherSubCategory.exists({ slug: slug });
            if (objExists) i += 1;
            else break;
        }
    }
    furtherSubCategory.name = data.name;
    furtherSubCategory.slug = slug;
    furtherSubCategory.keywords = data.keywords;
    furtherSubCategory.description = data.description;
    furtherSubCategory.subCategory = data.subCategory;
    furtherSubCategory.active = data.active;
    furtherSubCategory.save();
    res.json({ data: furtherSubCategory });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const furtherSubCategories = await FurtherSubCategory.find({ _id: getIds }).populate({
        path: 'products',
    });
    if (!furtherSubCategories) res.json({ data: [] });
    else res.json({ data: furtherSubCategories });
});

router.post('/delete', async (req, res) => {
    try {
        const data = req.body.data;
        data.forEach(async furtherSubCategory => {
            await Product.deleteMany({ furtherSubCategory: furtherSubCategory._id });
        });
        await FurtherSubCategory.deleteMany({ _id: req.body.ids });
        res.json({ data: 'success' });
    } catch (error) {
        console.log(error);
        res.json({ data: 'failed' });
    }
});

module.exports = router;