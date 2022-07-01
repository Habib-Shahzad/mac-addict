const router = require('express').Router();
const Country = require('../schema').country;
const Province = require('../schema').province;
const City = require('../schema').city;
const Area = require('../schema').area;
const Address = require('../schema').address;

router.get('/table-data', async (req, res) => {
    const countries = await Country.find({});
    if (!countries) res.json({ data: [] });
    else res.json({ data: countries });
});

router.get('/table-data-auto', async (req, res) => {
    const countries = await Country.find({});
    if (!countries) res.json({ data: [] });
    else res.json({ data: countries });
});

router.get('/get-countries', async (req, res) => {
    const countries = await Country.find({}, { _id: 0 });
    if (!countries) res.json({ data: [] });
    else res.json({ data: countries });
});

router.get('/get-countries-search', async (req, res) => {
    const countryText = req.query.countryText;
    if (countryText.trim() !== '') {
        const countries = await Country.find({ "name": { "$regex": countryText, "$options": "i" } });
        res.json({ data: countries });
    } else res.json({ data: [] });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newCountry = new Country({
        name: data.name,
        active: data.active,
    });
    newCountry.save();
    res.json({ data: newCountry });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const country = await Country.findOne({ _id: data._id });
    country.name = data.name;
    country.active = data.active;
    country.save();
    res.json({ data: country });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const countries = await Country.find({ _id: getIds }).populate({
        path: 'provinces',
        populate: {
            path: 'cities',
            populate: {
                path: 'areas',
                populate: {
                    path: 'addresses',
                }
            },
        }
    });
    if (!countries) res.json({ data: [] });
    else res.json({ data: countries });
});

router.post('/delete', async (req, res) => {
    await Country.deleteMany({ _id: { $in: req.body.data } });
    const provinces = await Province.find({ country: { $in: req.body.data } });
    await City.deleteMany({ province: { $in: provinces.map(x => x._id) } });
    await Province.deleteMany({ country: { $in: req.body.data } });

    const countries = await Country.find({});
    res.json({ success: true, data: countries });
});


router.post("/set-active", async (req, res) => {
    const { active, selected } = req.body;

    await Country.updateMany({ _id: { $in: selected } }, { active: active });
    const countries = await Country.find({});

    if (!countries) res.json({ data: [] });
    else res.json({ data: countries });

});


module.exports = router;