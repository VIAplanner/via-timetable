const express = require("express")
const Course = require("../models/course")
const cors = require("cors")
const rateLimit = require("express-rate-limit");
const router = new express.Router()

let corsOptions = {
    origin: 'https://viaplanner.ca', // allow only viaplanner to use the api 
    optionsSuccessStatus: 200
}


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per 15 minutes, so 9 requests per seconds
});


// route to get all course data for the search bar
router.get("/courses/searchbar", [limiter, cors(corsOptions)], async (req, res) => {
    try {

        const allCourses = await Course.find({})
        let allSearchBarValues = []
        for (let course of allCourses) {
            allSearchBarValues.push({ courseCode: course.courseCode, name: course.name })
        }

        res.send(allSearchBarValues)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

// route for getting data about a specific course
router.get("/courses/:courseCode", [limiter, cors(corsOptions)], async (req, res) => {

    try {

        const course = await Course.findOne({ courseCode: req.params.courseCode })

        if (!course) {
            res.status(404).send({ message: "no course exist with this code" })
        }
        else {
            res.send(course)
        }

    } catch (e) {
        res.status(500).send({ message: e.message })
    }

})

// route for create a course
router.post("/courses", cors(), async (req, res) => {

    try {
        const currCourse = new Course(req.body)

        await currCourse.save()
        res.status(201).send({ message: "course created successfully" })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }

})

module.exports = router