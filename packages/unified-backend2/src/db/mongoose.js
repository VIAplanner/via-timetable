const mongoose = require("mongoose")
const Schema = mongoose.Schema
require('dotenv').config()

console.log(process.env.MONGODB_URL)

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true })

const courseSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    division: {
        type: String,
        default: "NA"
    },
    department: {
        type: String,
        default: "NA"
    },
    prerequisites: {
        type: String,
        default: "NA"
    },
    exclusions: {
        type: String,
        default: "NA"
    },
    level: {
        type: Number,
        default: 0
    },
    campus: {
        type: String,
        default: "NA"
    },
    term: {
        type: String,
        default: "NA"
    },
    breadths: {
        type: Array,
        default: []
    }
})

const Course = mongoose.model("Course", courseSchema)