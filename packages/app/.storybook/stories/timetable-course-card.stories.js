
import TimetableCourseCard from '../../src/components/TimetableCourseCard.vue'


export default {
    component: TimetableCourseCard,
    title: 'Timetable Course Card'
}

export const withComputerScienceCourses = () => ({
    components: { TimetableCourseCard },
    data() {
        return {
            course: {
                codeAndName: "CSC209H5S Systems Programming",
                color: "#5CD1EB",
                meetingSections: [
                    {
                        day: "Monday",
                        end: 39600,
                        instructorName: "Andrew Petersen",
                        location: "IB 345",
                        section: "L0101",
                        start: 32400,
                    },
                    {
                        day: "Tuesday",
                        end: 64800,
                        instructorName: "TBA",
                        location: "DH 2026",
                        section: "P0109",
                        start: 61200
                    }]
            }

        }
    },
    template: '<timetable-course-card :course="course"/>',
})

