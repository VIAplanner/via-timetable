import { Cluster } from 'puppeteer-cluster';
import fs from "fs"

(async () => {
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

    const extractUTMCodes = async ({ page, data: url }) => {
        await page.goto(url, { waitUntil: 'networkidle0' });
        const allCourseCode = await page.evaluate(() => {
            let allCoursesDiv = document.querySelectorAll("div.selectize-dropdown-content")[3].querySelectorAll("div")
            let codes = []
            for (let courseDiv of allCoursesDiv) {
                codes.push(courseDiv.innerText)
            }
            return codes
        });
        console.log(allCourseCode, "pp")
    }

    const verifyUTM = async ({ page, data: url }) => {
        await page.goto(url, { waitUntil: 'networkidle0' });

    }


    cluster.queue('https://student.utm.utoronto.ca/timetable/', extractUTMCodes);
    await cluster.idle();
    await cluster.close();
})();
