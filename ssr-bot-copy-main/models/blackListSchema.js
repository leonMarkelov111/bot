const mongoose = require('mongoose')

const blSchema = new mongoose.Schema({
    userID: {type: Number, required: true},
    giverID: {type: Number, required: true},
    reason: {type: String, required: true},
    server: {type: Number, default: 0},
})

const model = mongoose.model("br_blacklist", blSchema)

module.exports = model;
