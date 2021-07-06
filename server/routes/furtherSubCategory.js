const router = require('express').Router();
const FurtherSubCategory = require('../schema').furtherSubCategory;
const SubCategory = require('../schema').subCategory;

router.get('/TableData', async (req, res) => {
    const furtherSubCategories = await FurtherSubCategory.find({});
    if (!furtherSubCategories) res.json({data: []});
    else res.json({data: furtherSubCategories});
});

router.get('/getFurtherSubCategories', async (req, res) => {
    const furtherSubCategories = await FurtherSubCategory.find({}, {_id: 0});
    if (!furtherSubCategories) res.json({data: []});
    else res.json({data: furtherSubCategories});
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const subCategory = await SubCategory.findOne({_id: data.subCategoryID});
    const newFurtherSubCategory = new FurtherSubCategory({
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        keywords: data.keywords,
        description: data.description,
        subCategory:subCategory,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    newFurtherSubCategory.save();
    res.json({data: 'success'});
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const subCategory = await SubCategory.findOne({_id: data.subCategoryID});
    const furtherSubCategory = await FurtherSubCategory.findOne({_id: data._id});
    furtherSubCategory.name = data.name;
    furtherSubCategory.slug = slugify(data.name, { lower: true });
    furtherSubCategory.keywords = data.keywords;
    furtherSubCategory.description = data.description;
    furtherSubCategory.subCategory = subCategory;
    furtherSubCategory.updatedAt = Date.now();
    furtherSubCategory.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const furtherSubCategories = await FurtherSubCategory.find({_id: getIds});
    if (!furtherSubCategories) res.json({data: []});
    else res.json({data: furtherSubCategories});
});

router.post('/delete', async (req, res) => {
    await FurtherSubCategory.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;