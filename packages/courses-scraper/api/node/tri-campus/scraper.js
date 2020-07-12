import { Cluster } from 'puppeteer-cluster';
// const fs = require("fs")

const formatCode = (rawCourseCode, rawTerm) => {
    let strippedTerm = rawTerm.split(" ")
    let year = parseInt(strippedTerm[0])
    let semester = strippedTerm[1]

    if(semester === "Fall"){
        return `${rawCourseCode}F${year}9`
    }
    else if(semester === "Winter"){
        return `${rawCourseCode}S${year}1`
    }
    else{
        return ""
    }
}

const scrape = async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 10,
        monitor: true,
        puppeteerOptions: { executablePath: "/usr/bin/chromium-browser" }
    });

    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.select("select[name='courseSearchResults_length']", "100")

    });

    cluster.queue('https://coursefinder.utoronto.ca/course-search/search/courseSearch?viewId=CourseSearch-FormView&methodToCall=start#search');

    await cluster.idle();
    await cluster.close();
}

scrape()