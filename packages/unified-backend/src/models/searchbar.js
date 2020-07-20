const mongoose = require("mongoose")
const Schema = mongoose.Schema

const valuesSchema = new Schema({
    courseCode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

const searchbarSchema = new Schema({
    values: [valuesSchema]
})

const Searchbar = mongoose.model("Searchbar", searchbarSchema)

module.exports = Searchbar