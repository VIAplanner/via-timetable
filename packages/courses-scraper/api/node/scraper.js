const puppeteer = require('puppeteer');

// convert 24 hours to seconds
const timeToSeconds = (hour) => {
    let splitTimes = hour.split(":")
    let hourSeconds = parseInt(splitTimes[0]) * 3600
    let minuteSeconds = parseInt(splitTimes[1]) * 60
    return hourSeconds + minuteSeconds
}

const formatLocations = (rawLocations) => {
    return rawLocations.replace(/^\s+|\s+$/g, '').split("\n")
}

const formatDays = (rawDays) => {
    let strippedDays = rawDays.replace(/^\s+|\s+$/g, '').split("\n")
    strippedDays.forEach((day, index, arr) => {
        debugger
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
const formatTimes = (rawStart, rawEnd, rawDays, rawLocations) => {
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
    let strippedDays = formatDays(rawDays)
    let strippedLocations = formatLocations(rawLocations)
    let allTimes = []

    for (let i = 0; i < strippedStart.length; i++) {
        let currDuration = strippedEnd[i] - strippedStart[i]

        let currTime = {
            day: strippedDays[i],
            start: strippedStart[i],
            end: strippedEnd[i],
            duration: currDuration,
            location: strippedLocations[i]
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

const formatInstructor = (rawInstructor) => {
    // removes \n at the end
    return rawInstructor.replace(/^\s+|\s+$/g, '').split("\n");
}

const formatDescription = (rawDescription) => {
    return rawDescription.split("\n\n")[0]
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

    return prereqs.replace(/^\s+|\s+$/g, '')
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

    return exclusions.replace(/^\s+|\s+$/g, '')
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


const scrape = async () => {

    const browser = await puppeteer.launch({
        headless: false,
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


    await page.goto(`https://student.utm.utoronto.ca/timetable?course=MAT133Y5`, { waitUntil: 'networkidle0' });

    let allInfo = await page.evaluate(() => {
        let allInfoDivs = document.querySelectorAll("tr.meeting_section")[0].querySelectorAll("td")
        let title = document.querySelector("div.course > span > h4").innerText
        let rawBreadths = document.querySelector("div.course > span > h4 > b").innerText
        let rawDescription = document.querySelector("div.infoCourseDetails").innerText
        let data = []
        for (let infoDiv of allInfoDivs) {
            data.push(infoDiv.innerText)
        }

        data.push(title)
        data.push(rawBreadths)
        data.push(rawDescription)
        return data
    });

    let currCourseData = {
        id: "",
        code: "",
        name: "",
        description: "",
        division: "University of Toronto Mississauga",
        department: "",
        prerequisites: "",
        exclusions: "",
        level: -1,
        campus: "UTM",
        term: "",
        breadths: [],
        meeting_sections: []
    }

    // console.log(allInfo)

    // console.log(formatID(courseCodes[0]))
    // console.log(formatInstructor(allInfo[2]))
    // console.log(formatTerm(courseCodes[0]), courseCodes[0])
    // console.log(formatDays(allInfo[7]))
    // console.log(timeToSeconds("9:00"))
    // console.log(formatLocations(allInfo[10]))
    // console.log(formatTimes(allInfo[8], allInfo[9], allInfo[7], allInfo[10]))
    // console.log(formatCourseCode(allInfo[14]))
    // console.log(formatName(allInfo[14]))
    // console.log(formatBreadths(allInfo[15]))
    // console.log(formatDescription(allInfo[16]))
    // console.log(formatPrereqs(allInfo[16]))
    // console.log(formatExclusions(allInfo[16]))
    console.log(formatLevel("MAT133Y5"))
    await browser.close();
}

// Start the script
scrape();