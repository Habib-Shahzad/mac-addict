const mongoose = require('mongoose');

require("dotenv").config();

const Area = require('../schema').area;
const City = require('../schema').city;

const areas = require('./areas.json');

const url = process.env.DATABASE_URL;

const createServer = async (callback) => {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database created!");
    // console.log(provinces);
    areas.forEach(async obj => {
        const city = await City.findOne({ name: obj.City });
        if (city) {
            const newArea = new Area({
                name: obj.Name,
                city: city,
                active: true,
            });
            newArea.save();
        }
    });
}

createServer();