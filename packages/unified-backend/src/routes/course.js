const express = require("express")
const Course = require("../models/course")
const router = new express.Router()

// route for getting data about a specific course
router.get("/courses/:code", async (req, res) => {

    try {
        const course = await Course.findOne({ code: req.params.code })
        if(!course){
            res.status(404).send({message: "no course exist with this code"})
        }
        else{
            res.send(course)
        }
    } catch (e) {
        res.status(500).send(e)
    }

})

// route to get all courses
router.get("/courses", async (req, res) => {

    try {
        const courses = await Course.find({})
        res.send(courses)
    } catch (e) {
        res.status(500).send(e)
    }

})

// route for create a course
router.post("/courses", async (req, res) => {

    const currCourse = new Course(req.body)

    try {
        await currCourse.save()
        res.status(201).send({ message: "course created successfully" })
    } catch (e) {
        res.status(400).send(e)
    }

})

module.exports = router