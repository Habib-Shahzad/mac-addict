const mongoose = require('mongoose');
require("dotenv").config();
const City = require('../schema').city;
const Province = require('../schema').province;

const cities = require('./cities.json');

const url = process.env.DATABASE_URL;

const createServer = async (callback) => {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database created!");
    const provinces = await Province.find({});
    // console.log(provinces);
    cities.forEach(async obj => {
        const province = await Province.findOne({ name: obj.Province });
        if (province) {
            const newCity = new City({
                name: obj.Name,
                province: province,
                active: true,
            });
            newCity.save();
        }
    });
}

createServer();