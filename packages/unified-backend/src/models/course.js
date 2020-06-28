const mongoose = require("mongoose")
const Schema = mongoose.Schema


// course model and validation
const timeSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        default: "NA"
    }
})

const meetingSectionSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    instructors: {
        type: [String],
        required: true
    },
    times: {
        type: [timeSchema],
        validate(value) {
            if (value.length === 0) {
                throw new Error("Times must be provided")
            }
        }
    },
    size: {
        type: Number,
        default: 0,
    },
    enrolment: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        default: "NA"
    }
})


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
        validate(value) {
            if (value.some(isNaN)) {
                throw new Error("breath must be numbers")
            }
        }
    },
    meeting_sections:  [meetingSectionSchema]
})

const Course = mongoose.model("Course", courseSchema)

module.exports = Course