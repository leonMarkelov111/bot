const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userID: {type: Number, required: true},
    convID: {type: Number, required: true},
    admin: {type: Number, default: 0},
    warns: {type: Number, default: 0},
    ban: {type: Boolean, default: false},
    banReason: {type: String, default: "None"},
    nickName: {type: String, default: ""},
    mute: {type: Boolean, default: false},
    muteTime: {type: Number, default: 0},
    muteWarning: {type: Number, default: 0},
})

const model = mongoose.model("br_conv_users", userSchema)

module.exports = model;
