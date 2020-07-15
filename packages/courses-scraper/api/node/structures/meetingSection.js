export default class MeetingSection {
    constructor(){
        this.sectionCode = ""
        this.instructors = []
        this.times = []
        this.size = 0
        this.enrolment = 0 
        this.method = ""
    }

    setSectionCode(sectionCode){
        this.sectionCode = sectionCode
    }

    addInstructor(instructor){
        this.instructors.push(instructor)
    }

    addTime(time){
        this.times.push(time)
    }

    setSize(size){
        this.size = size
    }

    setEnrolment(enrolment){
        this.enrolment = enrolment
    }

    setMethod(method){
        this.method = method
    }
}
