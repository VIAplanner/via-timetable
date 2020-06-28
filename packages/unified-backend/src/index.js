const express = require("express")
require("./db/mongoose")

const Course = require("./models/course")


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post("/courses", async (req, res) => {
    const currCourse = new Course(req.body)

    try {
        await currCourse.save()
        res.status(200).send({message: "course added successfully"})
    } catch (e) {
        res.status(400).send(e)

    }

})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})