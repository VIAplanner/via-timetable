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
        default: ""
    }
})

const meetingSectionSchema = new Schema({
    sectionCode: {
        type: String,
        required: true
    },
    instructors: {
        type: [String],
        required: true
    },
    times: [timeSchema],
    size: {
        type: Number,
        default: 0,
    },
    enrolment: {
        type: Number,
        default: 0
    },
    method: {
        type: String,
        required: true
    }
})


const courseSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    courseCode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    division: {
        type: String,
        default: ""
    },
    department: {
        type: String,
        default: ""
    },
    prerequisites: {
        type: String,
        default: ""
    },
    corequisites: {
        type: String,
        default: ""
    },
    exclusions: {
        type: String,
        default: ""
    },
    level: {
        type: Number,
        default: 0
    },
    campus: {
        type: String,
        default: ""
    },
    term: {
        type: String,
        default: ""
    },
    breadth: {
        type: String,
        default: ""
    },
    distribution: {
        type: String,
        default: ""
    },
    meeting_sections: [meetingSectionSchema]
})

const Course = mongoose.model("Course", courseSchema)

module.exports = Course