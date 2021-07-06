const router = require('express').Router();
const SubCategory = require('../schema').subCategory;
const Category = require('../schema').category;

router.get('/TableData', async (req, res) => {
    const subCategories = await SubCategory.find({});
    if (!subCategories) res.json({data: []});
    else res.json({data: subCategories});
});

router.get('/getSubCategories', async (req, res) => {
    const subCategories = await SubCategory.find({}, {_id: 0});
    if (!subCategories) res.json({data: []});
    else res.json({data: subCategories});
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const category = await Category.findOne({_id: data.categoryID});
    const newSubCategory = new SubCategory({
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        keywords: data.keywords,
        description: data.description,
        category:category,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    newSubCategory.save();
    res.json({data: 'success'});
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const category = await Category.findOne({_id: data.categoryID});
    const subCategory = await SubCategory.findOne({_id: data._id});
    subCategory.name = data.name;
    subCategory.slug = slugify(data.name, { lower: true });
    subCategory.keywords = data.keywords;
    subCategory.description = data.description;
    subCategory.category = category;
    subCategory.updatedAt = Date.now();
    subCategory.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const subCategories = await SubCategory.find({_id: getIds});
    if (!subCategories) res.json({data: []});
    else res.json({data: subCategories});
});

router.post('/delete', async (req, res) => {
    await SubCategory.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;