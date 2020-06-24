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

// return a times object matching the api requirements
const formatTimes = (rawStart, rawEnd, rawDays, rawLocations) => {
    let strippedStart = rawStart.replace(/^\s+|\s+$/g, '').split("\n")
    strippedStart.forEach((time, index, arr) => {
        arr[index] = timeToSeconds(time)
    })
    let strippedEnd = rawEnd.replace(/^\s+|\s+$/g, '').split("\n")
    strippedEnd.forEach((time, index, arr) => {
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


    await page.goto(`https://student.utm.utoronto.ca/timetable?course=${courseCodes[0]}`, { waitUntil: 'networkidle0' });

    let allInfo = await page.evaluate(() => {
        let allInfoDivs = document.querySelectorAll("tr.meeting_section")[0].querySelectorAll("td")
        let data = []
        for (let infoDiv of allInfoDivs) {
            data.push(infoDiv.innerText)
        }
        return data
    });

    let courseData = {
        id: "",
        code: "",
        name: "",
        description: "",
        division: "",
        department: "",
        prerequisites: "",
        exclusions: "",
        level: -1,
        campus: "",
        term: "",
        breadths: [],
        meeting_sections: []
    }

    console.log(allInfo)

    // console.log(formatID(courseCodes[0]))
    // console.log(formatInstructor(allInfo[2]))
    // console.log(formatTerm(courseCodes[0]), courseCodes[0])
    // console.log(formatDays(allInfo[7]))
    // console.log(timeToSeconds("9:00"))
    // console.log(formatLocations(allInfo[10]))
    console.log(formatTimes(allInfo[8], allInfo[9], allInfo[7], allInfo[10]))
    await browser.close();
}

// Start the script
scrape();