import puppeteer from "puppeteer"
import cliProgress from "cli-progress"
import ora from "ora"
import fs from "fs"

(async () => {
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
    await page.goto('https://coursefinder.utoronto.ca/course-search/search/courseSearch?viewId=CourseSearch-FormView&methodToCall=start#search', { waitUntil: 'networkidle0' });
    await page.select("select[name='courseSearchResults_length']", "100")

    let totalNumCourses = await page.evaluate(() => {
        return parseInt(document.querySelector("div.dataTables_info").innerText.split(" ")[3].replace(",", ""))
    })

    spinner.stop()

    // create a new progress bar instance and use shades_classic theme
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    let allCourseCodes = []

    progressBar.start(totalNumCourses, 0);

    while (true) {

        let currCourseCodes = await page.evaluate(() => {
            let currCourseCodes = []
            let rawOdd = document.querySelectorAll("tr.odd")
            let rawEven = document.querySelectorAll("tr.even")

            rawOdd.forEach((element) => {
                let courseCode = element.querySelectorAll("td")[1].innerText
                let term = element.querySelectorAll("td")[6].innerText
                currCourseCodes.push({ courseCode, term })
            })
            rawEven.forEach((element) => {
                let courseCode = element.querySelectorAll("td")[1].innerText
                let term = element.querySelectorAll("td")[6].innerText
                currCourseCodes.push({ courseCode, term })
            })

            return currCourseCodes
        })

        progressBar.increment(currCourseCodes.length)
        allCourseCodes = allCourseCodes.concat(currCourseCodes)


        let endResultNum = await page.evaluate(() => {
            return parseInt(document.querySelector("div.dataTables_info").innerText.split(" ")[1].split("-")[1].replace(",", ""))
        })

        // if we have reached the final course, stop the loop
        if (endResultNum === totalNumCourses) {
            break;
        } else {
            //click next
            await page.evaluate(() => {
                document.getElementById("courseSearchResults_next").click()
            })
        }
    }

    fs.writeFile(`output/allCourseCodes.json`, JSON.stringify(allCourseCodes), (err) => {
        if (err) {
            console.log(err);
        }
    });

    await browser.close();
    return progressBar.stop();

})()