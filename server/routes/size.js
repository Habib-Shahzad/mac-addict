const router = require('express').Router();
const Size = require('../schema').size;

router.get('/table-data', async (req, res) => {
    const sizes = await Size.find({});
    if (!sizes) res.json({ data: [] });
    else res.json({ data: sizes });
});

router.get('/table-data-auto', async (req, res) => {
    const sizes = await Size.find({});
    if (!sizes) res.json({ data: [] });
    else res.json({ data: sizes });
});

router.get('/get-size', async (req, res) => {
    const sizes = await Size.find({}, { _id: 0 });
    if (!sizes) res.json({ data: [] });
    else res.json({ data: sizes });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newSize = new Size({
        name: data.name,
    });
    newSize.save();
    res.json({ data: newSize });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const size = await Size.findOne({ _id: data._id });
    size.name = data.name;
    size.updatedAt = Date.now();
    size.save();
    res.json({ data: size });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const sizes = await Size.find({ _id: getIds });
    if (!sizes) res.json({ data: [] });
    else res.json({ data: sizes });
});

router.post('/delete', async (req, res) => {
    await Size.deleteMany({ _id: req.body.ids });
    res.json({ data: 'success' });
});

module.exports = router;