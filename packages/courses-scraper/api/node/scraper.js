const puppeteer = require('puppeteer');

const main = async () => {

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://student.utm.utoronto.ca/timetable/', { waitUntil: 'networkidle0' });

    // get list of all courses offered
    let courseCodes = await page.evaluate(() => {
        let allCoursesDiv = document.querySelectorAll("div[class='selectize-dropdown-content']")[3].querySelectorAll("div")
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

    console.log(allInfo)

    // console.log(courseCodes)
    // await browser.close();
}

// Start the script
main();