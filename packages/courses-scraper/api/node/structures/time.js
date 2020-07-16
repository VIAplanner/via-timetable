export default class Time {
    constructor() {
        this.day = ""
        this.start = 0
        this.end = 0
        this.duration = 0
        this.location = ""
    }

    setDay(day) {
        this.day = day
    }

    setStart(start) {
        this.start = start
    }

    setEnd(end) {
        this.end = end
    }

    setDuration(duration) {
        this.duration = duration
    }

    setLocation(location) {
        this.location = location
    }

}