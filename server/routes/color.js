const router = require('express').Router();
const Color = require('../schema').color;

const admin_auth = require('./middleware/admin_auth');


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

router.post('/add', admin_auth, async (req, res) => {
    const data = req.body;
    const newColor = new Color({
        name: data.name,
        hexCode: data.hexCode
    });
    newColor.save();
    res.json({ data: newColor });
});

router.post('/update', admin_auth, async (req, res) => {
    const data = req.body;
    const color = await Color.findOne({ _id: data._id });
    color.name = data.name;
    color.hexCode = data.hexCode;
    color.save();
    res.json({ data: color });
});



router.post('/delete', admin_auth, async (req, res) => {
    await Color.deleteMany({ _id: { $in: req.body.data } });
    const colors = await Color.find({});
    res.json({ success: true, data: colors });
});

module.exports = router;