require("./db/mongoose")
const express = require("express")
const sslRedirect = require('heroku-ssl-redirect');
const cors = require("cors")
const courseRouter = require("./routes/course")

const app = express()
const port = process.env.PORT || 3000

app.use(sslRedirect()); // enable ssl redirect
app.use(cors()) // allow access from all origins
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


app.get("/", (req, res) => {
    res.redirect('https://docs.viaplanner.ca/course-api/');
})

app.get("*", (req, res) => {
    res.redirect('https://docs.viaplanner.ca/course-api/');
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})