const prompt = require('prompt-sync')();

require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./schema').user;

const url = process.env.DATABASE_URL;

const createServer = async (callback) => {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database connected!");
    let firstName = '';
    while (firstName === '') firstName = prompt('First name: ').trim();
    let lastName = '';
    while (lastName === '') lastName = prompt('Last name: ').trim();
    let email = '';
    while (email === '') email = prompt('Email: ').trim();
    let contactNumber = '';
    while (contactNumber === '') contactNumber = prompt('Contact Number: ').trim();
    let password = '';
    while (password === '' || password.length <= 6) password = prompt.hide('Password: ');
    const confirmPassword = prompt.hide('Confirm Password: ');
    if (password !== confirmPassword) {
        console.log('Passwords do not match... aborting!');
        process.exit(0);
    };

    const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        contactNumber: contactNumber,
        admin: true
    });
    await newUser.save();
    process.exit(0);
}

createServer();