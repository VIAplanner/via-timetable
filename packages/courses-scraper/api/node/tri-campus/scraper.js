const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');
// const fs = require("fs")


const scrape = async () => {
    // const browser = await puppeteer.launch({
    //     executablePath: "/usr/bin/chromium-browser"
    // });
    // const page = await browser.newPage();
    // await page.goto('https://coursefinder.utoronto.ca/course-search/search/courseSearch?viewId=CourseSearch-FormView&methodToCall=start#search', { waitUntil: 'networkidle0' });
    // // await page.select("select[name='courseSearchResults_length']", "100")

    // let coursesRawInfo = await page.evaluate(() => {
    //     let allData = []
    //     allData.push(document.querySelector("div.dataTables_info").innerText)

    //     // return document.querySelector("tr.odd").querySelectorAll("td")[1].innerText
    //     // document.querySelector("tr.odd").querySelectorAll("td")[1].querySelector("a").click()


    //     // test.forEach((element, index, arr)=>{
    //     //     arr[index] = element.innerText
    //     // })

    //     return allData

    // })

    // console.log(coursesRawInfo)

    // await browser.close();

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        monitor: true,
        puppeteerOptions: { executablePath: "/usr/bin/chromium-browser" }
    });

    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.select("select[name='courseSearchResults_length']", "100")

        let coursesRawInfo = await page.evaluate(() => {
            let allData = []
            allData.push(document.querySelector("div.dataTables_info").innerText)
            return allData
        })

        console.log(coursesRawInfo)

    });

    cluster.queue('https://coursefinder.utoronto.ca/course-search/search/courseSearch?viewId=CourseSearch-FormView&methodToCall=start#search');
    cluster.queue('https://coursefinder.utoronto.ca/course-search/search/courseSearch?viewId=CourseSearch-FormView&methodToCall=start#search');
    // cluster.queue('http://www.wikipedia.org/');
    // many more pages

    await cluster.idle();
    await cluster.close();
}

scrape()