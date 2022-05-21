const mongoose = require('mongoose')

const convSchema = new mongoose.Schema({
    convID: {type: Number, required: true},
    status: {type: Number, default: 0},
    type: {type: Number, default: 0},
    server: {type: Number, default: 0},
    silence: {type: Number, default: 0}
})

const model = mongoose.model("br_conv", convSchema)

module.exports = model;
