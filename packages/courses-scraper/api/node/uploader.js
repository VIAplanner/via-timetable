require('dotenv').config()
const axios = require("axios")
const fs = require('fs');
const cliProgress = require('cli-progress'); // magic progress bar

const outputPath = "./output/courses/"
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
let numFiles = 0

// figure out how many files there are
fs.readdirSync(outputPath).forEach((fileName) => {
    numFiles++
})

progressBar.start(numFiles, 0, { speed: "N/A" });

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

fs.readdirSync(outputPath).forEach(async (fileName, index, arr) => {
    let rawCourseData = fs.readFileSync(outputPath + fileName);
    let courseData = JSON.parse(rawCourseData);
    let config = {
        headers: {
            "x-api-key": process.env.API_KEY
        }
    }

    await sleep(500);

    try {
        await axios.post(`${process.env.API_BASE_URL}/courses`, courseData, config)
    } catch (e) {
        console.log(e.message, outputPath + fileName)
    }

    progressBar.increment()

    // if it's the last element, stop the progress bar
    if (index === arr.length - 1) {
        progressBar.stop();

    }

});