import { Cluster } from 'puppeteer-cluster';
import Course from "../structures/course"
import MeetingSection from "../structures/meetingSection"
import Time from "../structures/time"
import fs from "fs"

// convert 24 hours to seconds
const timeToSeconds = (hour) => {
    let splitTimes = hour.split(":")
    let hourSeconds = parseInt(splitTimes[0]) * 3600
    let minuteSeconds = parseInt(splitTimes[1]) * 60
    return hourSeconds + minuteSeconds
}

// remove course code form the rawName
const formatName = (rawName) => {
    return rawName.slice(10, rawName.length)
}

// return the section code acronym
const formatSectionCode = (rawSectionCode) => {
    return rawSectionCode[0] + rawSectionCode.slice(4, rawSectionCode.length)
}

const formatEnrolment = (rawEnrolment) => {
    return parseInt(rawEnrolment)
}

const formatSize = (rawSize) => {
    return parseInt(rawSize)
}

// returns the instructors in a list
const formatInstructors = (rawInstructors) => {
    let strippedInstructors = rawInstructors.split("\n")
    strippedInstructors.splice(strippedInstructors.length - 1, 1)
    return strippedInstructors
}

// returns the locations in a list
const formatLocations = (rawLocations) => {
    let strippedLocations = rawLocations.split("\n")
    strippedLocations.splice(strippedLocations.length - 1, 1)
    return strippedLocations
}

// given a time such as 9:00-10:00, return a object containing these times in seconds, and duration
const formatTime = (rawTime) => {
    let strippedTimes = rawTime.split("-")
    strippedTimes.forEach((time, index, arr)=>{
        arr[index] = timeToSeconds(time)
    })

    return {
        start: strippedTimes[0],
        end: strippedTimes[1],
        duration: strippedTimes[1] = strippedTimes[0]
    }
}

// return a list of time object with the correct information
const createTime = (rawTime, rawLocations) => {
    let allTimes = []
    let timeStrings = rawTime.split("\n")
    let strippedLocations = formatLocations(rawLocations)
    timeStrings.splice(strippedTimes.length - 1, 1)

    timeStrings.forEach((timeString, index)=>{
        let strippedTimes = timeString.split(" ")
        let currTime = new Time()
        let currDay = strippedTimes[0]
        let timeData = formatTime(strippedTimes[1])

        currTime.setDay(currDay)
        currTime.setDuration(timeData.duration)
        currTime.setStart(timeData.start)
        currTime.setEnd(timeData.end)
        currTime.setLocation(strippedLocations[index] ? strippedLocations[index]: "")

        allTimes.push(currTime)
    })

}

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

            let rawCourseInfo = {
                rawName: document.querySelector("span.uif-headerText-span").innerText,
                rawDescription: document.querySelector("span[id='u32']").innerText,
                rawDivision: document.querySelector("span[id='u23']").innerText,
                rawDepartment: document.querySelector("span[id='u41']").innerText,
                rawPrerequisites: document.querySelector("span[id='u50']") ? document.querySelector("span[id='u50']").innerText : "",
                rawCorequisite: document.querySelector("span[id='u59']") ? document.querySelector("span[id='u59']").innerText : "",
                rawExclusions: document.querySelector("span[id='u68']") ? document.querySelector("span[id='u68']").innerText : "",
                rawCampus: document.querySelector("span[id='u149']").innerText,
                rawBreadth: "",
                rawDistribution: "",
                rawMeetingSections: []
            }

            // distribution and breadth requirement
            let campusNumber = rawCourseInfo.rawName[7]
            if (campusNumber === "1") {
                rawCourseInfo.rawDistribution = document.querySelector("span[id='u131']") ? document.querySelector("span[id='u131']").innerText : ""
                rawCourseInfo.rawBreadth = document.querySelector("span[id='u122']") ? document.querySelector("span[id='u122']").innerText : ""
            }
            else if (campusNumber === "3") {
                rawCourseInfo.rawBreadth = document.querySelector("span[id='u104']") ? document.querySelector("span[id='u104']").innerText : ""
            }
            else if (campusNumber === "5") {
                rawCourseInfo.rawDistribution = document.querySelector("span[id='u113']") ? document.querySelector("span[id='u113']").innerText : ""
            }

            let rawMeetingSectionsOdd = document.querySelectorAll("tr.odd")
            let rawMeetingSectionsEven = document.querySelectorAll("tr.even")

            rawMeetingSectionsOdd.forEach(rawMeetingSection => {

                let rawRowInfo = rawMeetingSection.querySelectorAll("td")

                let rawSectionInfo = {
                    rawSectionCode: rawRowInfo[0].innerText,
                    rawTimes: rawRowInfo[1].innerText,
                    rawInstructors: rawRowInfo[2].innerText,
                    rawLocations: rawRowInfo[3].innerText,
                    rawSize: rawRowInfo[4].innerText,
                    rawEnrolment: rawRowInfo[5].innerText,
                    rawMethod: rawRowInfo[7].innerText,
                }

                rawCourseInfo.rawMeetingSections.push(rawSectionInfo)
            })

            rawMeetingSectionsEven.forEach(rawMeetingSection => {

                let rawRowInfo = rawMeetingSection.querySelectorAll("td")

                let rawSectionInfo = {
                    rawSectionCode: rawRowInfo[0].innerText,
                    rawTimes: rawRowInfo[1].innerText,
                    rawInstructors: rawRowInfo[2].innerText,
                    rawLocations: rawRowInfo[3].innerText,
                    rawSize: rawRowInfo[4].innerText,
                    rawEnrolment: rawRowInfo[5].innerText,
                    rawMethod: rawRowInfo[7].innerText,
                }

                rawCourseInfo.rawMeetingSections.push(rawSectionInfo)
            })

            return rawCourseInfo
        })

        currCourse.setId(formatID(courseCode, term))

        console.log(currCourse)
        // console.log(rawCourseData)
    });

    let baseURL = "https://coursefinder.utoronto.ca/course-search/search/courseInquiry?methodToCall=start&viewId=CourseDetails-InquiryView&courseId="
    // let rawInfo = fs.readFileSync("output/allCourseCodes.json");
    // let allCourseInfo = JSON.parse(rawInfo)
    let allCourseInfo = [{ courseCode: "CSCA08H3", term: "2020 Fall" }]

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