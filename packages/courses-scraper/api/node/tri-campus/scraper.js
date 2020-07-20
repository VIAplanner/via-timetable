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

// returns the level of the courses
const formatLevel = (courseCode) => {
    let levelChar = courseCode[3]

    if (levelChar === "1" || levelChar === "A") {
        return 1
    }
    else if (levelChar === "2" || levelChar === "B") {
        return 2
    }
    else if (levelChar === "3" || levelChar === "C") {
        return 3
    }
    else if (levelChar === "4" || levelChar === "D") {
        return 4
    }
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

const formatTerm = (rawCourseCode, rawTerm) => {
    if (rawTerm.includes("Fall")) {
        if (rawTerm.includes("+") && rawCourseCode[6] === "Y") {
            return "2020 Full Year"
        }
        else {
            return "2020 Fall"
        }
    }
    else if (rawTerm.includes("Winter")) {
        return "2021 Winter"
    }
}

// given a time such as 9:00-10:00, return a object containing these times in seconds, and duration
const formatTime = (rawTime) => {
    let strippedTimes = rawTime.split("-")
    strippedTimes.forEach((time, index, arr) => {
        arr[index] = timeToSeconds(time)
    })

    return {
        start: strippedTimes[0],
        end: strippedTimes[1],
        duration: strippedTimes[1] - strippedTimes[0]
    }
}

const termToEnding = (rawTerm) => {
    if (rawTerm === "2020 Fall") {
        return "F20209"
    }
    else if (rawTerm === "2020 Fall +") {
        return "Y20209"
    }
    else if (rawTerm === "2021 Winter") {
        return "S20211"
    }
}

// return a list of time object with the correct information
const createTime = (rawTimes, rawLocations) => {
    let allTimes = []
    let timeStrings = rawTimes.split("\n")
    let strippedLocations = formatLocations(rawLocations)
    timeStrings.splice(timeStrings.length - 1, 1)

    timeStrings.forEach((timeString, index) => {
        let strippedTimes = timeString.split(" ")
        let currTime = new Time()
        let currDay = strippedTimes[0]
        let timeData = formatTime(strippedTimes[1])

        currTime.setDay(currDay)
        currTime.setDuration(timeData.duration)
        currTime.setStart(timeData.start)
        currTime.setEnd(timeData.end)
        currTime.setLocation(strippedLocations[index] ? strippedLocations[index] : "")

        allTimes.push(currTime)
    })

    return allTimes
}

// return the id of the courses, empty string is it's a summer course
const formatID = (rawCourseCode, rawTerm) => {
    return `${rawCourseCode}${termToEnding(rawTerm)}`
}

const formatCourseCode = (rawCourseCode, rawTerm) => {
    let strippedTerm = rawTerm.split(" ")
    let semester = strippedTerm[1]

    if (semester === "Fall") {
        let termLetter = strippedTerm[2] === "+" ? "Y" : "F"
        return `${rawCourseCode}${termLetter}`
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
        maxConcurrency: 15,
        monitor: true,
        puppeteerOptions: { executablePath: "/usr/bin/chromium-browser" },
    });

    // Event handler to be called in case of problems
    cluster.on('taskerror', (err, data) => {
        console.log(`Error crawling ${JSON.stringify(data)}: ${err.message}`);
    });


    await cluster.task(async ({ page, data }) => {
        await page.goto(data.url, { waitUntil: 'networkidle0' });

        let rawCourseData = await page.evaluate(() => {

            if (document.querySelector("span.uif-headerText-span").innerText === "Error") {
                return
            }

            let rawCourseInfo = {
                rawName: document.querySelector("span.uif-headerText-span").innerText,
                rawDescription: document.querySelector("span[id='u32']").innerText,
                rawDivision: document.querySelector("span[id='u23']").innerText,
                rawDepartment: document.querySelector("span[id='u41']").innerText,
                rawPrerequisites: document.querySelector("span[id='u50']") ? document.querySelector("span[id='u50']").innerText : "",
                rawCorequisites: document.querySelector("span[id='u59']") ? document.querySelector("span[id='u59']").innerText : "",
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

        // if the course is empty
        if (!rawCourseData) {
            return console.log(data.courseCode, data.term)
        }

        let currCourse = new Course()
        currCourse.setId(formatID(data.courseCode, data.term))
        currCourse.setCourseCode(formatCourseCode(data.courseCode, data.term))
        currCourse.setName(formatName(rawCourseData.rawName))
        currCourse.setDescription(rawCourseData.rawDescription)
        currCourse.setDivision(rawCourseData.rawDivision)
        currCourse.setDepartment(rawCourseData.rawDepartment)
        currCourse.setPrerequisites(rawCourseData.rawPrerequisites)
        currCourse.setCorequisites(rawCourseData.rawCorequisites)
        currCourse.setExclusions(rawCourseData.rawExclusions)
        currCourse.setLevel(formatLevel(data.courseCode))
        currCourse.setCampus(rawCourseData.rawCampus)
        currCourse.setTerm(formatTerm(data.courseCode, data.term))
        currCourse.setBreath(rawCourseData.rawBreadth)
        currCourse.setDistribution(rawCourseData.rawDistribution)

        rawCourseData.rawMeetingSections.forEach((rawMeetingSection) => {
            let currMeetingSection = new MeetingSection()
            let strippedInstructors = formatInstructors(rawMeetingSection.rawInstructors)
            let strippedTimes = createTime(rawMeetingSection.rawTimes, rawMeetingSection.rawLocations)

            currMeetingSection.setSectionCode(formatSectionCode(rawMeetingSection.rawSectionCode))
            currMeetingSection.setSize(formatSize(rawMeetingSection.rawSize))
            currMeetingSection.setEnrolment(formatEnrolment(rawMeetingSection.rawEnrolment))
            currMeetingSection.setMethod(rawMeetingSection.rawMethod)

            strippedInstructors.forEach(currInstructor => {
                currMeetingSection.addInstructor(currInstructor)
            })

            strippedTimes.forEach(currTime => {
                currMeetingSection.addTime(currTime)
            })

            currCourse.addMeetingSection(currMeetingSection)
        })

        currCourse.save()
    });

    let baseURL = "https://coursefinder.utoronto.ca/course-search/search/courseInquiry?methodToCall=start&viewId=CourseDetails-InquiryView&courseId="
    let rawInfo = fs.readFileSync("output/allCourseCodes.json");
    let allCourseInfo = JSON.parse(rawInfo)

    // these are for testing only
    // allCourseInfo = [
    //     { courseCode: "ABP101Y1", term: "2020 Fall +" },
    //     { courseCode: "ECO100Y5", term: "2020 Fall +" },
    //     { courseCode: "STA257H1", term: "2020 Fall" }, // coreqs
    //     { courseCode: "CSC108H5", term: "2020 Fall" },
    //     { courseCode: "CSCA08H3", term: "2020 Fall" },
    //     { courseCode: "CSCA08H3", term: "2021 Winter" },
    //     { courseCode: "CSC108H1", term: "2020 Fall" },
    //     { courseCode: "CSC358H5", term: "2021 Winter" }, // locations
    //     { courseCode: "ANT299Y5", term: "2020 Summer Y" }, // summer
    //     { courseCode: "ANT299Y5", term: "2020 Fall" }, // Invalid
    //     { courseCode: "ANT366H1", term: "2020 Fall +" }, // Exception
    //     {courseCode: "HIS210H5", term: "2020 Fall"}, // empty meeting sections
    //     {courseCode: "BIO328H5", term: "2020 Fall +"}, // full year 0.5 credit
    //     {courseCode: "POL309Y5", term: "2020 Fall"}, // half year 1 credit
    // ]

    allCourseInfo.forEach((currCourseInfo) => {
        if (!currCourseInfo.term.includes("Summer")) {
            cluster.queue({ url: `${baseURL}${formatID(currCourseInfo.courseCode, currCourseInfo.term)}`, courseCode: currCourseInfo.courseCode, term: currCourseInfo.term })
        }
    })

    await cluster.idle();
    await cluster.close();
}

scrape()