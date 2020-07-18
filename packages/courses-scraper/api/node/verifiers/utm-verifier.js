import { Cluster } from 'puppeteer-cluster';
import puppeteer from "puppeteer"
import ora from 'ora' // spinning circle
import fs from "fs"

const formatCourseCode = (rawCourseCode) => {
    return rawCourseCode.slice(0, 9)
}

const formatSectionCode = (rawSectionCode) => {
    return rawSectionCode[0] + rawSectionCode.slice(3, 8)
}

(async () => {

    const spinner = ora({
        text: "Calculating total time", spinner: {
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

    const baseURL = "https://student.utm.utoronto.ca/timetable"
    const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser"
    });
    const page = await browser.newPage();
    await page.goto(baseURL, { waitUntil: 'networkidle0' });

    // get list of all courses offered at UTM
    let courseCodes = await page.evaluate(() => {
        // the fourth drop down contains the data for all courses
        let allCoursesDiv = document.querySelectorAll("div.selectize-dropdown-content")[3].querySelectorAll("div")
        let codes = []
        for (let courseDiv of allCoursesDiv) {
            codes.push(courseDiv.innerText)
        }
        return codes
    });

    await browser.close();
    spinner.stop()

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 15,
        monitor: true,
        puppeteerOptions: { executablePath: "/usr/bin/chromium-browser" },
    });

    // Event handler to be called in case of problems
    cluster.on('taskerror', (err, data) => {
        console.log(`Error crawling ${JSON.stringify(data)}: ${err.message}`);
    });

    const verify = async ({ page, data }) => {
        await page.goto(data.url, { waitUntil: 'networkidle0' });
        let allCoursesRawInfo = await page.evaluate(() => {

            // array of courses raw info
            let allCoursesRawInfo = document.querySelectorAll("div.course")
            let finalCourses = []

            for (let rawCourseInfo of allCoursesRawInfo) {

                // object containing all info about the current course
                let courseInfo = {
                    rawTitle: rawCourseInfo.querySelector("span > h4").innerText,
                    rawClosedMeetingSections: []
                }

                // raw html for all the sections
                let allSectionDivs = rawCourseInfo.querySelectorAll("tr.meeting_section")

                for (let currSectionDiv of allSectionDivs) {


                    if (currSectionDiv.innerText.includes("Closed")) {
                        let rawSectionCode = currSectionDiv.querySelectorAll("td")[1].innerText
                        courseInfo.rawClosedMeetingSections.push(rawSectionCode)
                    }
                }

                finalCourses.push(courseInfo)
            }

            return finalCourses

        });

        for (let currRawCourse of allCoursesRawInfo) {
            let fullCourseCode = formatCourseCode(currRawCourse.rawTitle)
            let currCourse = JSON.parse(fs.readFileSync(`output/courses/${fullCourseCode}.json`))

            currRawCourse.rawClosedMeetingSections.forEach(currRawSection => {
                let currSectionCode = formatSectionCode(currRawSection)

                currCourse.meeting_sections.forEach((meetingSection, index, arr) => {
                    if (meetingSection.sectionCode === currSectionCode) {
                        arr.splice(index, 1)
                    }
                })
            })

            fs.writeFileSync(`output/courses/${fullCourseCode}.json`, JSON.stringify(currCourse))

        }

    }

    // testing purpose only
    // courseCodes = ["MAT132"]

    courseCodes.forEach(courseCode => {
        cluster.queue({ url: `${baseURL}?course=${courseCode}` }, verify)
    })


    await cluster.idle();
    await cluster.close();
})();
