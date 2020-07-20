import fs from "fs"

export default class Course {
    constructor() {
        this.id = ""
        this.courseCode = ""
        this.name = ""
        this.description = ""
        this.division = ""
        this.department = ""
        this.prerequisites = ""
        this.corequisites = ""
        this.exclusions = ""
        this.level = 0
        this.campus = ""
        this.term = ""
        this.breadth = ""
        this.distribution = ""
        this.meeting_sections = []
    }

    setId(id) {
        this.id = id
    }

    setCourseCode(courseCode) {
        this.courseCode = courseCode
    }

    setName(name) {
        this.name = name
    }

    setDescription(description) {
        this.description = description
    }

    setDivision(division) {
        this.division = division
    }

    setDepartment(department) {
        this.department = department
    }

    setPrerequisites(prerequisites) {
        this.prerequisites = prerequisites
    }

    setCorequisites(corequisites) {
        this.corequisites = corequisites
    }

    setExclusions(exclusions) {
        this.exclusions = exclusions
    }

    setLevel(level) {
        this.level = level
    }

    setCampus(campus) {
        this.campus = campus
    }

    setTerm(term) {
        this.term = term
    }

    setBreath(breath) {
        this.breadth = breath
    }

    setDistribution(distribution) {
        this.distribution = distribution
    }

    addMeetingSection(meetingSection) {
        this.meeting_sections.push(meetingSection)
    }

    // save the current course as json in output
    save() {
            fs.writeFile(`output/courses/${this.courseCode}.json`, JSON.stringify(this), (err) => {
                if (err) {
                    console.log(err);
                }
            });
    }
}