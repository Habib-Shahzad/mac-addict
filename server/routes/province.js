const router = require('express').Router();
const Province = require('../schema').province;
const City = require('../schema').city;

const admin_auth = require('./middleware/admin_auth');


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

router.post('/add', admin_auth, async (req, res) => {
    const data = req.body;
    const newProvince = new Province({
        name: data.name,
        country: data.country,
        active: data.active,
    });
    newProvince.save();
    res.json({ data: newProvince });
});

router.post('/update', admin_auth, async (req, res) => {
    const data = req.body;
    const province = await Province.findOne({ _id: data._id });
    province.name = data.name;
    province.country = data.country;
    province.active = data.active;
    province.save();
    res.json({ data: province });
});


router.post('/delete', admin_auth, async (req, res) => {
    await Province.deleteMany({ _id: { $in: req.body.data } });
    await City.deleteMany({ province: { $in: req.body.data } });
    const provinces = await Province.find({}).populate('country');
    res.json({ success: true, data: provinces });
});


router.post("/set-active", admin_auth, async (req, res) => {
    const { active, selected } = req.body;

    await Province.updateMany({ _id: { $in: selected } }, { active: active });
    const provinces = await Province.find({}).populate('country');

    if (!provinces) res.json({ data: [] });
    else res.json({ data: provinces });

});

module.exports = router;