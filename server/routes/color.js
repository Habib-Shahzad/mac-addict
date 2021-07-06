const router = require('express').Router();
const Color = require('../schema').color;

router.get('/TableData', async (req, res) => {
    const colors = await Color.find({});
    if (!colors) res.json({data: []});
    else res.json({data: colors});
});

router.get('/getColors', async (req, res) => {
    const colors = await Color.find({}, {_id: 0});
    if (!colors) res.json({data: []});
    else res.json({data: colors});
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newColor = new Color({
        name: data.name,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    newColor.save();
    res.json({data: 'success'});
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const color = await Color.findOne({_id: data._id});
    color.name = data.name;
    color.updatedAt = Date.now();
    color.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const colors = await Color.find({_id: getIds});
    if (!colors) res.json({data: []});
    else res.json({data: colors});
});

router.post('/delete', async (req, res) => {
    await Color.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;