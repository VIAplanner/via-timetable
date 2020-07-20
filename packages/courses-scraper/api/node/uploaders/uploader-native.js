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


let allCourseData = []
let allSearchbarValues = { values: [] }

fs.readdirSync(outputPath).forEach((fileName) => {
    let rawCourseData = fs.readFileSync(outputPath + fileName);
    let currCourseData = JSON.parse(rawCourseData);
    allCourseData.push(currCourseData)
    allSearchbarValues.values.push({ courseCode: currCourseData.courseCode, name: currCourseData.name })
})

MongoClient.connect(url, { useUnifiedTopology: true }, async (err, db) => {
    if (err) {
        console.log(err)
        return db.close();
    }

    try{
        await Promise.all([db.db("data").collection("courses").insertMany(allCourseData), db.db("data").collection("searchbars").insertOne(allSearchbarValues)])
    }catch(err){
        db.close();
        spinner.stop()
        return console.log(err)
    }

    console.log("\nuploaded all courses and search bar values onto database")

    db.close();
    spinner.stop()
});