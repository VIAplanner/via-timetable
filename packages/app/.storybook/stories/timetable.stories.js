
import Timetable from '../../src/components/Timetable.vue'
import { object } from '@storybook/addon-knobs';


export default {
    component: Timetable,
    title: 'Timetable'
}

export const withValidSecondYearComputerScienceStudentSchedule = () => ({
    components: { Timetable },
    data() {
        return {
            timetable: {
                Monday: [
                    {
                        courseCode: "CSC258H5S",
                        section: "L0101",
                        start: 32400,
                        end: 39600,
                        location: "IB 345"
                    },
                    {
                        courseCode: "STA258H5S",
                        section: "L0101",
                        start: 54000,
                        end: 61200,
                        location: "MN 1210"
                    }
                ],
                Tuesday: [
                    {
                        courseCode: "CSC207H5S",
                        section: "L0101",
                        start: 39600,
                        end: 46800,
                        location: "MN 1270"
                    },
                    {
                        courseCode: "CSC258H5S",
                        section: "P0109",
                        start: 61200,
                        end: 64800,
                        location: "DH 2026"
                    }
                ],
                Wednesday: [
                    {
                        courseCode: "CSC290H5S",
                        section: "L0101",
                        start: 50400,
                        end: 57600,
                        location: "MN 1270"
                    },
                    {
                        courseCode: "STA258H5S",
                        section: "T0105",
                        start: 61200,
                        end: 64800,
                        location: "DH 2080"
                    }
                ],
                Thursday: [
                    {
                        courseCode: "CSC290H5S",
                        section: "T0101",
                        start: 39600,
                        end: 46800,
                        location: "MN 1270"
                    },
                    {
                        courseCode: "CSC209H5S",
                        section: "P0111",
                        start: 61200,
                        end: 64800,
                        location: "DH 2026"
                    }
                ],
                Friday: [
                    {
                        courseCode: "CSC209H5S",
                        section: "L0104",
                        start: 50400,
                        end: 57600,
                        location: "MN 1270"
                    }
                ]
            },
            courseCodeColorMap: new Map(Object.entries({ CSC258H5S: "#FBB347", STA258H5S: "#83CC77", CSC207H5S: "#4C91F9", CSC290H5S: "#F26B83", CSC209H5S: "#5CD1EB" }))
        }
    },
    template: '<timetable :timetable="timetable" :courseCodeColorMap="courseCodeColorMap" />',
})

