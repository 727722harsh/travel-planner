const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    title: String,
    description: String,
    phone: String,
    fromDate: String,
    toDate: String,
    fromTime: String,
    toTime: String,
});

const locationSchema = new mongoose.Schema({
    name: String,
    plans: [planSchema],
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    locations: [locationSchema],
});

module.exports = mongoose.model("User", userSchema);
