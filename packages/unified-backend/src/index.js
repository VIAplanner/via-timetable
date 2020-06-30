require("./db/mongoose")
const express = require("express")
const cors = require("cors")
const sslRedirect = require('heroku-ssl-redirect');
const courseRouter = require("./routes/course")

const app = express()
const port = process.env.PORT || 3000

app.use(sslRedirect()); // enable ssl redirect
app.use(cors()) // allow access from all origins
app.use(express.json()) // parse request as json
app.use(courseRouter)

app.get("/", (req, res) => {
    res.redirect('https://docs.viaplanner.ca/course-api/');
})

app.get("*", (req, res) => {
    res.redirect('https://docs.viaplanner.ca/course-api/');
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})