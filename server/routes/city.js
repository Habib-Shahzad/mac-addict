const router = require('express').Router();
const City = require('../schema').city;
const Area = require('../schema').area;
const Address = require('../schema').address;

router.get('/table-data', async (req, res) => {
    const cities = await City.find({}).populate({
        path: 'province',
        populate: {
            path: 'country',
        }
    });
    if (!cities) res.json({ data: [] });
    else res.json({ data: cities });
});

router.get('/table-data-auto', async (req, res) => {
    const cities = await City.find({});
    if (!cities) res.json({ data: [] });
    else res.json({ data: cities });
});

router.get('/get-cities', async (req, res) => {
    const cities = await City.find({}, { _id: 0 });
    if (!cities) res.json({ data: [] });
    else res.json({ data: cities });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newCity = new City({
        name: data.name,
        province: data.province,
        active: data.active,
    });
    newCity.save();
    res.json({ data: newCity });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const city = await City.findOne({ _id: data._id });
    city.name = data.name;
    city.province = data.province;
    city.active = data.active;
    city.save();
    res.json({ data: city });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const cities = await City.find({ _id: getIds }).populate({
        path: 'areas',
    });
    if (!cities) res.json({ data: [] });
    else res.json({ data: cities });
});

router.post('/delete', async (req, res) => {
    try {
        const data = req.body.data;
        data.forEach(async city => {
            city.areas.forEach(async area => {
                await Address.deleteMany({ area: area._id });
            });
            await Area.deleteMany({ city: city._id });
        });
        await City.deleteMany({ _id: req.body.ids });
        res.json({ data: 'success' });
    } catch (error) {
        console.log(error);
        res.json({ data: 'failed' });
    }
});

module.exports = router;