const router = require('express').Router();
const Size = require('../schema').size;
require('dotenv').config();

const admin_auth = require('./middleware/admin_auth');

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

router.post('/add', admin_auth, async (req, res) => {
    const newSize = new Size({ name: req.body.name });
    await newSize.save();
    res.json({ data: newSize });
});

router.post('/update', admin_auth, async (req, res) => {
    const data = req.body;
    const size = await Size.findOne({ _id: data._id });
    size.name = data.name;
    size.updatedAt = Date.now();
    size.save();
    res.json({ data: size });
});


router.post('/delete', admin_auth, async (req, res) => {
    await Size.deleteMany({ _id: { $in: req.body.data } });
    const sizes = await Size.find({});
    res.json({ success: true, data: sizes });
});



module.exports = router;