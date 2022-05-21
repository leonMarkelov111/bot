const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userID: {type: Number, required: true},
    admin: {type: Number, default: 0},
    leader: {type: Number, default: 0},
    leaderName: {type: String, default: "None"},
    warns: {type: Number, default: 0},
    ban: {type: Boolean, default: false},
    banReason: {type: String, default: "None"},
    nickName: {type: String, default: ""}
})

const model = mongoose.model("br_accounts", userSchema)

module.exports = model;
