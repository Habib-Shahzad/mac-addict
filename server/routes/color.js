const router = require('express').Router();
const Color = require('../schema').color;

router.get('/table-data', async (req, res) => {
    const colors = await Color.find({});
    if (!colors) res.json({ data: [] });
    else res.json({ data: colors });
});

router.get('/table-data-auto', async (req, res) => {
    const colors = await Color.find({});
    if (!colors) res.json({ data: [] });
    else res.json({ data: colors });
});

router.get('/get-Color', async (req, res) => {
    const colors = await Color.find({}, { _id: 0 });
    if (!colors) res.json({ data: [] });
    else res.json({ data: colors });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newColor = new Color({
        name: data.name,
        hexCode: data.hexCode
    });
    newColor.save();
    res.json({ data: newColor });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const color = await Color.findOne({ _id: data._id });
    color.name = data.name;
    color.hexCode = data.hexCode;
    color.save();
    res.json({ data: color });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const colors = await Color.find({ _id: getIds });
    if (!colors) res.json({ data: [] });
    else res.json({ data: colors });
});

router.post('/delete', async (req, res) => {
    await Color.deleteMany({ _id: { $in: req.body.data } });
    const colors = await Color.find({});
    res.json({ success: true, data: colors });
});

module.exports = router;