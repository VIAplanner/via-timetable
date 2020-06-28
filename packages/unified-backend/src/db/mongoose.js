const mongoose = require("mongoose")
const Course = require("../db/models/course")
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true })

const course1 = new Course({
    "id": "ANT101H5S20211",
    "code": "ANT101H5S",
    "name": "Introduction to Biological Anthropology and Archaeology",
    "description": "Anthropology is the global and holistic study of human biology and behaviour, and includes four subfields: biological anthropology, archaeology, sociocultural anthropology and linguistic anthropology. The material covered is directed to answering the question: What makes us human? This course is a survey of biological anthropology and archaeology. [24L, 12P]",
    "division": "University of Toronto Mississauga",
    "department": "NA",
    "prerequisites": "",
    "exclusions": "ANT100Y1 or ANTA01H3",
    "level": 100,
    "campus": "UTM",
    "term": "2021 Winter",
    "breadths": [1],
    "meeting_sections": [
        {
            "code": "L0101",
            "instructors": ["Fukuzawa, S."],
            "times": [
                {
                    "day": "MONDAY",
                    "start": 54000,
                    "end": 57600,
                    "duration": 3600,
                    "location": "CC 1080"
                },
                {
                    "day": "WEDNESDAY",
                    "start": 54000,
                    "end": 57600,
                    "duration": 3600,
                    "location": "CC 1080"
                }
            ],
            "size": "400",
            "enrolment": "0",
            "notes": ""
        },
    ]
})

course1.save().then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err)
})