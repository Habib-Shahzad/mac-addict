const router = require('express').Router();
const Country = require('../schema').country;

router.get('/TableData', async (req, res) => {
    const countries = await Country.find({});
    if (!countries) res.json({data: []});
    else res.json({data: countries});
});

router.get('/getCountries', async (req, res) => {
    const countries = await Country.find({}, {_id: 0});
    if (!countries) res.json({data: []});
    else res.json({data: countries});
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newCountry = new Country({
        name: data.name,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    newCountry.save();
    res.json({data: 'success'});
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const country = await Country.findOne({_id: data._id});
    country.name = data.name;
    country.updatedAt = Date.now();
    country.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const countries = await Country.find({_id: getIds});
    if (!countries) res.json({data: []});
    else res.json({data: countries});
});

router.post('/delete', async (req, res) => {
    await Country.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;