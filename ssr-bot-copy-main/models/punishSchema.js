const mongoose = require('mongoose')

const punishSchema = new mongoose.Schema({
    userID: {type: Number, required: true},
    giveID: {type: Number, required: true},
    convID: {type: Number, required: true},
    type: {type: String, required: true},
    reason: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true}
})

const model = mongoose.model("br_punish_history", punishSchema)

module.exports = model;
