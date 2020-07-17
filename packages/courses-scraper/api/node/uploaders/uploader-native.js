require('dotenv').config()
const fs = require('fs');
const ora = require("ora")
const url = process.env.MONGODB_URL;
const outputPath = "./output/courses/"
const MongoClient = require('mongodb').MongoClient;

const spinner = ora({
    text: "Uploading", spinner: {
        "interval": 80,
        "frames": [
            "⠋",
            "⠙",
            "⠹",
            "⠸",
            "⠼",
            "⠴",
            "⠦",
            "⠧",
            "⠇",
            "⠏"
        ]
    }
}).start();


// figure out how many files there are
let allCourseData = []

fs.readdirSync(outputPath).forEach((fileName) => {
    let rawCourseData = fs.readFileSync(outputPath + fileName);
    let courseData = JSON.parse(rawCourseData);
    allCourseData.push(courseData)
})

MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    db.db("data").collection("courses").insertMany(allCourseData, (err, res) => {
        if (err) throw err;
        console.log("\nNumber of documents inserted: " + res.insertedCount);
        db.close();
        spinner.stop()
    });
});