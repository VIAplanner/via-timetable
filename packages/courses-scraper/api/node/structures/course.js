export default class Course {
    constructor() {
        this.id = ""
        this.courseCode = ""
        this.name = ""
        this.description = ""
        this.division = ""
        this.department = ""
        this.prerequisites = ""
        this.exclusions = ""
        this.level = 0
        this.campus = ""
        this.term = ""
        this.breadths = []
        this.meetingSections = []
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

    addBreath(breath) {
        this.breadths.push(breath)
    }

    addMeetingSection(meetingSection) {
        this.meetingSections.push(meetingSection)
    }
}