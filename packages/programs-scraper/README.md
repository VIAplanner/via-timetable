# UTM Programs Scraper

## Overview
This package contains the scraper for obtaining UTM programs. The scraped programs will be stored as js files, please visit the [Documentation Website](https://uoftcoursetools.tech/course-api/#_4-subject) to see the schema of the data. 

To see an example usage of the scraper, run

`
python3 program_scraper.py
`

The hierarchy of the data is:
`
subjects
{
    program1,
    program2,
    ...
}
`
where a singular subject could contain 1 or more programs.

## API Component Breakdown
- [programs_scraper.py](./program_scraper.py): 
  - There are 2 sources used:
    - [Academic Calendar](https://student.utm.utoronto.ca/calendar//program_list.pl) contains all subjects offered at UTM
    - [Program Selection Guide](https://www.utm.utoronto.ca/registrar/office-registrar-publications/program-selection-guide) contains all program types and is also used to check for dead programs scraped from the Academic Calendar.
  - The scraped data are temporally stores as objects defined in [program.py](./api/program.py) as well as [subject.py](./api/subject.py) then converted to json to be stored in output
  - **Note:** Currently, the scraper only supports UTM programs. Unlike the course scraper, there is no easy implementation that will allow for scraping of all three campuses due to the different design of the program website. (Check out the academic calendar for [UTSG](https://fas.calendar.utoronto.ca/) and [UTSC](https://utsc.calendar.utoronto.ca/))
- [dead_programs_finder.py](./api/dead_programs_finder.py):
  - returns a list of dead subjects in UTM under **output/dead_programs.txt** . By dead, it means these programs no longer exist
- [dead_subjects_finder.py](./api/dead_subjects_finder.py):
  - returns a list of dead subjects in UTM under **output/dead_subjects.txt** . By dead, it means these subjects no longer exist
- [uploader.py](./api/uploader.py)
  - Uploads the json files stored in **output** onto MongoDB.
  - Can be used to upload to other server by changing the server address on line 9.
  - Progress is displayed in the terminal.



