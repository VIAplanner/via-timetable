const express = require("express")
const Course = require("../models/course")
const router = new express.Router()

// route to get all course data for the search bar
router.get("/courses/searchbar", async (req, res) => {
    try {

        if (req.query.api_key != process.env.API_KEY) {
            throw new Error("Invalid API key")
        }

        const allCourses = await Course.find({})
        let allSearchBarValues = []
        for (let course of allCourses) {
            allSearchBarValues.push({ code: course.code, name: course.name })
        }

        res.send(allSearchBarValues)

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

// route for getting data about a specific course
router.get("/courses/:code", async (req, res) => {

    try {
        if (req.query.api_key != process.env.API_KEY) {
            throw new Error("Invalid API key")
        }

        const course = await Course.findOne({ code: req.params.code })
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

// route to get all courses
router.get("/courses", async (req, res) => {

    try {
        if (req.query.api_key != process.env.API_KEY) {
            throw new Error("Invalid API key")
        }

        const allCourses = await Course.find({})
        res.send(allCourses)
    } catch (e) {
        res.status(500).send({ message: e.message })
    }

})

// route for create a course
router.post("/courses", async (req, res) => {

    try {
        if (req.query.api_key != process.env.API_KEY) {
            throw new Error("Invalid API key")
        }

        const currCourse = new Course(req.body)

        await currCourse.save()
        res.status(201).send({ message: "course created successfully" })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }

})

module.exports = router