const router = require('express').Router();
const Brand = require('../schema').brand;
const Product = require('../schema').product;
const slugify = require('slugify');

router.get('/table-data', async (req, res) => {
    const brands = await Brand.find({});
    if (!brands) res.json({ data: [] });
    else res.json({ data: brands });
});

router.get('/table-data-auto', async (req, res) => {
    const brands = await Brand.find({});
    if (!brands) res.json({ data: [] });
    else res.json({ data: brands });
});

router.get('/get-brands', async (req, res) => {
    const brands = await Brand.find({}, { _id: 0 });
    if (!brands) res.json({ data: [] });
    else res.json({ data: brands });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    let i = 0;
    let slug = '';
    while (true) {
        slug = `${slugify(data.name, { lower: true })}-${i}`;
        const objExists = await Brand.exists({ slug: slug });
        if (objExists) i += 1;
        else break;
    }
    const newBrand = new Brand({
        name: data.name,
        slug: slug,
        keywords: data.keywords,
        description: data.description,
        active: data.active
    });
    newBrand.save();
    res.json({ data: newBrand });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const brand = await Brand.findOne({ _id: data._id });
    let slug = '';
    if (brand.name === data.name) slug = brand.slug;
    else {
        let i = 0;
        while (true) {
            slug = `${slugify(data.name, { lower: true })}-${i}`;
            const objExists = await Brand.exists({ slug: slug });
            if (objExists) i += 1;
            else break;
        }
    }
    brand.name = data.name;
    brand.slug = slug;
    brand.keywords = data.keywords;
    brand.description = data.description;
    brand.active = data.active;
    brand.save();
    res.json({ data: brand });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const brands = await Brand.find({ _id: getIds }).populate({
        path: 'products'
    });
    if (!brands) res.json({ data: [] });
    else res.json({ data: brands });
});

router.post('/delete', async (req, res) => {
    try {
        const data = req.body.data;
        data.forEach(async brand => {
            await Product.deleteMany({ brand: brand._id });
        });
        await Brand.deleteMany({ _id: req.body.ids });
        res.json({ data: 'success' });
    } catch (error) {
        console.log(error);
        res.json({ data: 'failed' });
    }
});



router.post("/set-active", async (req, res) => {
    const { active, selected } = req.body;
    await Brand.updateMany({ _id: { $in: selected } }, { active: active });
    const brands = await Brand.find({});
    if (!brands) res.json({ data: [] });
    else res.json({ data: brands });

});
module.exports = router;