const router = require('express').Router();
const Province = require('../schema').province;
const City = require('../schema').city;
const Area = require('../schema').area;
const Address = require('../schema').address;

router.get('/table-data', async (req, res) => {
    const provinces = await Province.find({}).populate('country');
    if (!provinces) res.json({ data: [] });
    else res.json({ data: provinces });
});

router.get('/table-data-auto', async (req, res) => {
    const provinces = await Province.find({});
    if (!provinces) res.json({ data: [] });
    else res.json({ data: provinces });
});

router.get('/get-provinces', async (req, res) => {
    const provinces = await Province.find({}, { _id: 0 });
    if (!provinces) res.json({ data: [] });
    else res.json({ data: provinces });
});

router.get('/get-provinces-search', async (req, res) => {
    const provinceText = req.query.provinceText;
    const country = JSON.parse(req.query.country);
    if (provinceText.trim() !== '') {
        const provinces = await Province.find({ "name": { "$regex": provinceText, "$options": "i" }, country: country[0] });
        res.json({ data: provinces });
    } else res.json({ data: [] });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newProvince = new Province({
        name: data.name,
        country: data.country,
        active: data.active,
    });
    newProvince.save();
    res.json({ data: newProvince });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const province = await Province.findOne({ _id: data._id });
    province.name = data.name;
    province.country = data.country;
    province.active = data.active;
    province.save();
    res.json({ data: province });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const provinces = await Province.find({ _id: getIds }).populate({
        path: 'cities',
        populate: {
            path: 'areas'
        }
    });
    if (!provinces) res.json({ data: [] });
    else res.json({ data: provinces });
});

router.post('/delete', async (req, res) => {
    try {
        const data = req.body.data;
        data.forEach(async province => {
            province.cities.forEach(async city => {
                city.areas.forEach(async area => {
                    await Address.deleteMany({ area: area._id });
                });
                await Area.deleteMany({ city: city._id });
            });
            await City.deleteMany({ province: province._id });
        });
        await Province.deleteMany({ _id: req.body.ids });
        res.json({ data: 'success' });
    } catch (error) {
        console.log(error);
        res.json({ data: 'failed' });
    }
});

module.exports = router;