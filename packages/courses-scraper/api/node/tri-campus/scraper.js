import { Cluster } from 'puppeteer-cluster';
import Course from "../structures/course"
import MeetingSection from "../structures/meetingSection"
import Time from "../structures/time"
import fs from "fs"

const formatID = (rawCourseCode, rawTerm) => {
    let strippedTerm = rawTerm.split(" ")
    let year = parseInt(strippedTerm[0])
    let semester = strippedTerm[1]

    if (semester === "Fall") {
        return `${rawCourseCode}F${year}9`
    }
    else if (semester === "Winter") {
        return `${rawCourseCode}S${year}1`
    }
    else {
        return ""
    }
}

const formatCourseCode = (rawCourseCode, rawTerm) => {
    let strippedTerm = rawTerm.split(" ")
    let semester = strippedTerm[1]

    if (semester === "Fall") {
        return `${rawCourseCode}F`
    }
    else if (semester === "Winter") {
        return `${rawCourseCode}S`
    }
    else {
        return ""
    }
}

const scrape = async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 10,
        monitor: true,
        puppeteerOptions: { executablePath: "/usr/bin/chromium-browser" },
    });

    // Event handler to be called in case of problems
    cluster.on('taskerror', (err, data) => {
        console.log(`Error crawling ${data}: ${err.message}`);
    });


    await cluster.task(async ({ page, data }) => {
        await page.goto(data.url, { waitUntil: 'networkidle0' });
        let currCourse = new Course()
        currCourse.setCourseCode(data.courseCode)
        currCourse.setTerm(data.term)

        let rawCourseData = await page.evaluate(() => {

            let courseInfo = {
                rawName: document.querySelector("span.uif-headerText-span").innerText,
                rawDescription: document.querySelector("span[id='u32']").innerText,
                rawDivision: document.querySelector("span[id='u23']").innerText,
                rawDepartment: document.querySelector("span[id='u41']").innerText, 
                rawPrerequisites: document.querySelector("span[id='u50']") != null ? document.querySelector("span[id='u50']").innerText : "", 
                rawExclusions: document.querySelector("span[id='u68']") != null ? document.querySelector("span[id='u68']").innerText : "", 
                rawCampus: document.querySelector("span[id='u149']").innerText,
                rawBreadth: document.querySelector("span[id='u12']") != null ?document.querySelector("span[id='u12']").innerText : "",
                rawDistribution: document.querySelector("span[id='u122']") != null ? document.querySelector("span[id='u122']").innerText : "",
                rawMeetingSections: []
            }

            return courseInfo
        })

        // console.log(currCourse)
        console.log(rawCourseData)
    });

    // let rawInfo = fs.readFileSync("output/allCourseCodes.json");
    // let allCourseInfo = JSON.parse(rawInfo)
    let allCourseInfo = [{ courseCode: "CSC108H5", term: "2020 Fall" }]
    let baseURL = "https://coursefinder.utoronto.ca/course-search/search/courseInquiry?methodToCall=start&viewId=CourseDetails-InquiryView&courseId="

    allCourseInfo.forEach((currCourseInfo) => {
        let courseID = formatID(currCourseInfo.courseCode, currCourseInfo.term)
        let fullCourseCode = formatCourseCode(currCourseInfo.courseCode, currCourseInfo.term)

        if (courseID !== "") {
            cluster.queue({ url: `${baseURL}${courseID}`, courseCode: fullCourseCode, term: currCourseInfo.term })
        }

    })

    await cluster.idle();
    await cluster.close();
}

scrape()