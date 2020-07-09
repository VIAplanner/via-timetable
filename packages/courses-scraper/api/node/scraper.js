const puppeteer = require('puppeteer');
const cliProgress = require('cli-progress'); // magic progress bar
const ora = require('ora'); // spinning circle
const fs = require("fs")

// convert 24 hours to seconds
const timeToSeconds = (hour) => {
    let splitTimes = hour.split(":")
    let hourSeconds = parseInt(splitTimes[0]) * 3600
    let minuteSeconds = parseInt(splitTimes[1]) * 60
    return hourSeconds + minuteSeconds
}

// return an array of all locations for the current section
const formatLocations = (rawLocations, fullCourseCode) => {

    let allLocations = []
    // skip every other location since it's for the next semester
    if (fullCourseCode[8] === "Y") {

        for (let i = 0; i < rawLocations.length; i += 2) {
            allLocations.push(rawLocations[i])
        }

    }
    else {
        allLocations = rawLocations.split("\n") 
        allLocations.forEach((location, index, arr)=>{
            if(location.length <= 2){
                arr[index] = ""
            }
        })
    }

    return allLocations

}

const formatDays = (rawDays) => {
    let strippedDays = rawDays.replace(/^\s+|\s+$/g, '').split("\n")
    strippedDays.forEach((day, index, arr) => {
        if (day === "MO") {
            arr[index] = "MONDAY"
        }
        else if (day === "TU") {
            arr[index] = "TUESDAY"
        }
        else if (day === "WE") {
            arr[index] = "WEDNESDAY"
        }
        else if (day === "TH") {
            arr[index] = "THURSDAY"
        }
        else if (day === "FR") {
            arr[index] = "FRIDAY"
        }
    })

    return strippedDays
}

// return a times array matching the api requirements
const formatTimes = (rawStart, rawEnd, rawDays, rawLocations, fullCourseCode) => {
    let strippedStart = rawStart.replace(/^\s+|\s+$/g, '').split("\n")
    strippedStart.forEach((time, index, arr) => {
        // convert times to seconds
        arr[index] = timeToSeconds(time)
    })
    let strippedEnd = rawEnd.replace(/^\s+|\s+$/g, '').split("\n")
    strippedEnd.forEach((time, index, arr) => {
        // convert times to seconds
        arr[index] = timeToSeconds(time)
    })

    let strippedLocations = formatLocations(rawLocations, fullCourseCode)
    let strippedDays = formatDays(rawDays)
    let allTimes = []

    for (let i = 0; i < strippedStart.length; i++) {
        let currDuration = strippedEnd[i] - strippedStart[i]

        let currTime = {
            day: strippedDays[i],
            start: strippedStart[i],
            end: strippedEnd[i],
            duration: currDuration,
            location: strippedLocations[i] != undefined ? strippedLocations[i] : ""
        }

        allTimes.push(currTime)
    }

    return allTimes
}

const formatLevel = (courseCode) => {
    if (courseCode[3] === '1') {
        return 100
    }
    else if (courseCode[3] === '2') {
        return 200
    }
    else if (courseCode[3] === '3') {
        return 300
    }
    else if (courseCode[3] === '4') {
        return 400
    }
}

const formatCourseCode = (rawTitle) => {
    return rawTitle.split(" - ")[0]
}

const formatName = (rawTitle) => {
    let tempName = rawTitle.split(" - ")[1]
    // remove the distribution
    return tempName.slice(0, tempName.length - 6)
}

const formatBreadths = (rawBreadths) => {
    if (rawBreadths === "(SCI)") {
        return [1]
    }
    else if (rawBreadths === "(SSc)") {
        return [2]
    }
    else if (rawBreadths === "(HUM)") {
        return [3]
    }

}

const formatID = (courseCode) => {
    // fall or full year course
    if (courseCode[8] === 'F' || courseCode[8] === 'Y') {
        return `${courseCode}20209`
    }
    else { // winter course
        return `${courseCode}20211`
    }
}

// returns a array of instructors
const formatInstructor = (rawInstructor) => {
    let tempInstructors = rawInstructor.replace(/^\s+|\s+$/g, '')
    if (tempInstructors != "") {
        return tempInstructors.split("\n");
    }
    else {
        return []
    }
}

const formatDescription = (rawDescription) => {
    return rawDescription.split("\n\n")[0].replace("\n", " ")
}

const formatPrereqs = (rawDescription) => {
    let tempPrereqs = rawDescription.split("\n\n")
    let prereqs = ""
    for (let i = 0; i < tempPrereqs.length; i++) {
        if (tempPrereqs[i].includes("Prerequisites:")) {
            prereqs = tempPrereqs[i].slice(15, tempPrereqs[i].length)
            break;
        }
    }

    return prereqs.replace(/^\s+|\s+$/g, '').replace("\n", " ")
}

const formatExclusions = (rawDescription) => {
    let tempExclusions = rawDescription.split("\n\n")
    let exclusions = ""
    for (let i = 0; i < tempExclusions.length; i++) {
        if (tempExclusions[i].includes("Exclusion:")) {
            exclusions = tempExclusions[i].slice(11, tempExclusions[i].length)
            break;
        }
    }

    return exclusions.replace(/^\s+|\s+$/g, '').replace("\n", " ")
}

const formatTerm = (courseCode) => {
    // fall course
    if (courseCode[8] === 'F') {
        return "2020 Fall"
    }
    // winter cours 
    else if (courseCode[8] === 'S') {
        return "2021 Winter"
    }
    // full year course
    else {
        return "2020 Full Year"
    }
}


const scrape = async (startRatio, endRatio) => {

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

    const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser"
    });
    const page = await browser.newPage();
    await page.goto('https://student.utm.utoronto.ca/timetable/', { waitUntil: 'networkidle0' });

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

    let start = 0
    let end = courseCodes.length
    if (startRatio != -1 && endRatio != -1) {
        start = Math.floor(parseInt(courseCodes.length / 3) * startRatio)
        end = Math.floor(parseInt(courseCodes.length / 3) * endRatio)
    }

    spinner.stop()

    // create a new progress bar instance and use shades_classic theme
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    progressBar.start(end - start, 0);

    for (let i = start; i < end; i++) {

        let courseCode = courseCodes[i]

        await page.goto(`https://student.utm.utoronto.ca/timetable?course=${courseCode}`, { waitUntil: 'networkidle0' });

        // returns an array of objects containing info for all courses matching the current course code
        let coursesRawInfo = await page.evaluate(() => {

            // array of courses raw info
            let allCoursesRawInfo = document.querySelectorAll("div.course")
            let finalCourses = []

            for (let rawCourseInfo of allCoursesRawInfo) {

                // object containing all info about the current course
                let courseInfo = {
                    rawTitle: rawCourseInfo.querySelector("span > h4").innerText,
                    rawBreadths: rawCourseInfo.querySelector("span > h4 > b") != null ? rawCourseInfo.querySelector("span > h4 > b").innerText : 0,
                    rawDescription: rawCourseInfo.querySelector("div.infoCourseDetails").innerText,
                    rawMeetingSections: []
                }

                // raw html for all the sections
                let allSectionDivs = rawCourseInfo.querySelectorAll("tr.meeting_section")

                for (let currSectionDiv of allSectionDivs) {

                    let currSecInfo = [] // array of all data for the current section
                    let rawInfo = currSectionDiv.querySelectorAll("td")

                    if (rawInfo.length < 11) {
                        continue
                    }

                    for (let currInfo of rawInfo) {
                        currSecInfo.push(currInfo.innerText)
                    }

                    let allLocations = []
                    for (let rawLocations of rawInfo[10].querySelectorAll("span")) {
                        // checks if the span is empty or equal to "&nbsp;" or "&nbsp;&nbsp;"
                        allLocations.push(rawLocations.innerText.length > 2 ? rawLocations.innerText : "")
                    }

                    // override the location to be a list of the location data if it's a full year course
                    if (allLocations.length != 0) {
                        currSecInfo[10] = allLocations
                    }

                    courseInfo.rawMeetingSections.push(currSecInfo)

                }

                finalCourses.push(courseInfo)
            }

            return finalCourses

        });


        // need to loop because a course could be in both fall and winter
        for (let currCourseRawInfo of coursesRawInfo) {

            let currCourseData = {
                id: "",
                courseCode: "",
                name: "",
                description: "",
                division: "University of Toronto Mississauga",
                department: "NA",
                prerequisites: "",
                exclusions: "",
                level: 0,
                campus: "UTM",
                term: "",
                breadths: [],
                meeting_sections: []
            }

            // full code with semester
            let fullCourseCode = formatCourseCode(currCourseRawInfo.rawTitle)

            // current course data
            currCourseData.name = formatName(currCourseRawInfo.rawTitle)
            currCourseData.description = formatDescription(currCourseRawInfo.rawDescription)
            currCourseData.prerequisites = formatPrereqs(currCourseRawInfo.rawDescription)
            currCourseData.exclusions = formatExclusions(currCourseRawInfo.rawDescription)
            currCourseData.breadths = formatBreadths(currCourseRawInfo.rawBreadths)

            // data that only needs the courseCode
            currCourseData.id = formatID(fullCourseCode)
            currCourseData.courseCode = fullCourseCode
            currCourseData.level = formatLevel(fullCourseCode)
            currCourseData.term = formatTerm(fullCourseCode)

            for (let rawSectionInfo of currCourseRawInfo.rawMeetingSections) {

                let currMeetingSection = {
                    sectionCode: "",
                    instructors: [],
                    times: [],
                    size: 0,
                    enrolment: 0,
                    notes: ""
                }

                // skip online async and closed sections
                if (rawSectionInfo[11] == "Online Asynchronous" || rawSectionInfo[12].includes("Closed")) {
                    continue
                }

                currMeetingSection.sectionCode = `${rawSectionInfo[1][0]}${rawSectionInfo[1].slice(3, rawSectionInfo[1].length)}`
                currMeetingSection.instructors = formatInstructor(rawSectionInfo[2])
                currMeetingSection.times = formatTimes(rawSectionInfo[8], rawSectionInfo[9], rawSectionInfo[7], rawSectionInfo[10], fullCourseCode)
                currMeetingSection.size = rawSectionInfo[4]
                currMeetingSection.enrolment = rawSectionInfo[3]
                currMeetingSection.notes = rawSectionInfo[12]

                currCourseData.meeting_sections.push(currMeetingSection)

            }

            // write course data to json is the course is not empty
            if (currCourseData.meeting_sections.length != 0) {

                fs.writeFile(`output/${fullCourseCode}.json`, JSON.stringify(currCourseData), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }

        }

        progressBar.increment()
    }


    await browser.close();
    // stop the progress bar
    progressBar.stop();
    return
}

// determines how much to scrape. First is the first third, second is the second third and so on
let startRatio = -1
let endRatio = -1
if (process.argv.length === 3) {
    if (process.argv[2] === 'first') {
        startRatio = 0
        endRatio = 1
    }
    else if (process.argv[2] === 'second') {
        startRatio = 1
        endRatio = 2
    }
    else if (process.argv[2] === 'third') {
        startRatio = 2
        endRatio = 3
    }
    else {
        console.log("Usage: node scraper.js (optional: first, second, third)")
        return
    }
}


// Start the scraper
scrape(startRatio, endRatio);