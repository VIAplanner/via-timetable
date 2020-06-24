const puppeteer = require('puppeteer');
async function main() {
    const browser = await puppeteer.launch({
        // headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://student.utm.utoronto.ca/timetable/?course=CSC108H5', { waitUntil: 'networkidle0' });
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log(bodyHTML)
    // await page.screenshot({
    //     path: 'example.png'
    // });
    await browser.close();
}

// Start the script
main();