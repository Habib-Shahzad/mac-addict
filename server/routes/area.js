const router = require('express').Router();
const Area = require('../schema').area;
const Address = require('../schema').address;

router.get('/table-data', async (req, res) => {
    const areas = await Area.find({}).populate({
        path: 'city',
        populate: {
            path: 'province',
            populate: {
                path: 'country'
            }
        }
    });
    if (!areas) res.json({ data: [] });
    else res.json({ data: areas });
});

router.get('/table-data-auto', async (req, res) => {
    const areas = await Area.find({});
    if (!areas) res.json({ data: [] });
    else res.json({ data: areas });
});

router.get('/get-areas', async (req, res) => {
    const areas = await Area.find({}, { _id: 0 });
    if (!areas) res.json({ data: [] });
    else res.json({ data: areas });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newArea = new Area({
        name: data.name,
        city: data.city,
        active: data.active,
    });
    newArea.save();
    res.json({ data: newArea });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const area = await Area.findOne({ _id: data._id });
    area.name = data.name;
    area.city = data.city;
    area.active = data.active;
    area.save();
    res.json({ data: area });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const areas = await Area.find({ _id: getIds });
    if (!areas) res.json({ data: [] });
    else res.json({ data: areas });
});

router.post('/delete', async (req, res) => {
    try {
        const data = req.body.data;
        data.forEach(async area => {
            await Address.deleteMany({ area: area._id });
        });
        await Area.deleteMany({ _id: req.body.ids });
        res.json({ data: 'success' });
    } catch (error) {
        console.log(error);
        res.json({ data: 'failed' });
    }
});

module.exports = router;