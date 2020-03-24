import TimetableEvent from '../../src/components/TimetableEvent.vue'
import { object } from '@storybook/addon-knobs';

export default {
    component: TimetableEvent,
    title: 'TimetableEvent'
}

export const CSC258MondayLecture = () => ({
    components: { TimetableEvent },
    data() {
        return {
            event: {
                courseCode: "CSC258H5S",
                section: "L0101",
                start: 32400,
                end: 39600,
                location: "IB 345"
            },
            color: "#FBB347"
        }
    },
    template: '<TimetableEvent :event="event" :color="color" style="width: 200px;"/>'
})