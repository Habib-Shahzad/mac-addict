const router = require('express').Router();
const City = require('../schema').city;
const Province = require('../schema').province;

router.get('/TableData', async (req, res) => {
    const cities = await City.find({});
    if (!cities) res.json({data: []});
    else res.json({data: cities});
});

router.get('/getCities', async (req, res) => {
    const cities = await City.find({}, {_id: 0});
    if (!cities) res.json({data: []});
    else res.json({data: cities});
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const province = await Province.findOne({_id: data.provinceID});
    const newCity = new City({
        name: data.name,
        province:province,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    newCity.save();
    res.json({data: 'success'});
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const province = await Province.findOne({_id: data.provinceID});
    const city = await City.findOne({_id: data._id});
    city.name = data.name;
    city.province = province;
    city.updatedAt = Date.now();
    city.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const cities = await City.find({_id: getIds});
    if (!cities) res.json({data: []});
    else res.json({data: cities});
});

router.post('/delete', async (req, res) => {
    await City.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;