var crypto = require("crypto");
var id = crypto.randomBytes(64).toString('hex');
console.log(id);