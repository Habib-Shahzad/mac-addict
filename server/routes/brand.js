const router = require('express').Router();
const Brand = require('../schema').brand;
const slugify = require('slugify');

router.get('/TableData', async (req, res) => {
    const brands = await Brand.find({});
    if (!brands) res.json({data: []});
    else res.json({data: brands});
});

router.get('/getBrands', async (req, res) => {
    const brands = await Brand.find({}, {_id: 0});
    if (!brands) res.json({data: []});
    else res.json({data: brands});
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newBrand = new Brand({
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        keywords: data.keywords,
        description: data.description,
        active: data.active,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    newBrand.save();
    res.json({data: 'success'});
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const brand = await Brand.findOne({_id: data._id});
    brand.name = data.name;
    brand.slug = slugify(data.name, { lower: true });
    brand.keywords = data.keywords;
    brand.description = data.description;
    brand.active = data.active;
    brand.updatedAt = Date.now();
    brand.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const brands = await Brand.find({_id: getIds});
    if (!brands) res.json({data: []});
    else res.json({data: brands});
});

router.post('/delete', async (req, res) => {
    await Brand.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;