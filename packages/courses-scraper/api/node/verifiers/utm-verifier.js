import { Cluster } from 'puppeteer-cluster';
import puppeteer from "puppeteer"
import fs from "fs"

(async () => {
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

    console.log(courseCodes)
    await browser.close();

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

    const verify = async ({ page, data: url }) => {
        await page.goto(url, { waitUntil: 'networkidle0' });

    }




    await cluster.idle();
    await cluster.close();
})();
