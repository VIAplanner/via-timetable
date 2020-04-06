# UTM Course Scraper

## Overview
This package contains the scraper for obtaining UTM courses. The scraped courses will be stored as js files, please visit our [Documentation Website](https://uoftcoursetools.tech/course-api/#_1-course) to see the schema of the data. 

To see an example usage of the scraper, run

`
python3 example_usage.py
`

## API Component Breakdown
- [scraper.py](./api/scraper.py): 
  - Displays progress in the terminal.
  - Export the scraped data as json files, with the name of the courses as its name. i.e CSC207H5F will be stored as CSC207H5F.json.
- [uoftscraper.py](./api/uoftscraper.py):
  - Retrieves course data from [Course Finder](http://coursefinder.utoronto.ca/course-search/search) using BeautifulSoup and Requests. 
  - Different course soups are placed in a queue, then parsed later by multiple workers (multi-threading). 
  - **Note**: Currently, the scraper only returns UTM courses. However, this can be easily improved on in the scraper by deleting the if statement on line 41.
- [uploader.py](./api/uploader.py)
  - Uploads the json files stored in **output** onto MongoDB.
  - Can be used to upload to other server by changing the server address on line 9.
  - Progress is displayed in the terminal.


