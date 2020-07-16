require("./db/mongoose")
const express = require("express")
const courseRouter = require("./routes/course")
const rateLimit = require("express-rate-limit");
const cors = require("cors")
const axios = require("axios")
const app = express()
const port = process.env.PORT || 3000

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per 15 minutes, so 9 requests per seconds
});

app.set('trust proxy', 1);

app.use(express.json()) // parse request as json
app.use(courseRouter)

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`)
        else
            next()
    })
}


app.get("/", cors(), (req, res) => {
    res.redirect('https://docs.viaplanner.ca/course-api/');
})

app.get("/status", [cors(), limiter], async (req, res) => {
    try {
        await axios.get("https://viaplanner.ca")
        res.send({
            schemaVersion: 1,
            label: "Status",
            message: "up",
            color: "success"
        })
    } catch (e) {
        res.send({
            schemaVersion: 1,
            label: "Status",
            message: "down",
            color: "critical",
        })
    }
})

app.get("*", cors(), (req, res) => {
    res.redirect('https://docs.viaplanner.ca/course-api/');
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})