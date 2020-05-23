<template>
    <v-row
        @mouseover="hovered = true"
        @mouseleave="hovered = false"
        justify="center"
    >
        <h2 class="day-label">
            {{ weekday }}
        </h2>
        <div v-if="hovered || locked">
            <v-btn @click="unlockDay" v-if="locked" icon>
                <v-icon>mdi-lock</v-icon>
            </v-btn>
            <v-btn @click="lockDay" v-else icon>
                <v-icon>mdi-lock-open</v-icon>
            </v-btn>
        </div>
    </v-row>
</template>

<script>
import { mapActions, mapMutations, mapGetters} from "vuex";

export default {
    data() {
        return {
            locked: false,
            hovered: false,
            currStart: 32400,
        };
    },
    props: {
        weekday: String,
    },
    computed: {
        ...mapGetters(["getLockedSections"])
    },
    methods: {
        ...mapActions(["selectCourse", "deleteCourse"]),
        ...mapMutations(["lockSection"]),
        lockDay() {
            // let currSecData = {
            //     name: `Locked Section`,
            //     courseCode: `Lock${this.weekday}${this.currStart}`,
            //     meeting_sections: [
            //         {
            //             sectionCode: "L0001",
            //             instructors: ["NA"],
            //             times: [
            //                 {
            //                     day: this.weekday,
            //                     start: this.currStart,
            //                     end: this.currStart + 3600,
            //                     location: "NA",
            //                 },
            //             ],
            //         },
            //     ],
            // };

            this.lockToggle();
        },
        unlockDay() {
            this.lockToggle();
        },
        lockToggle() {
            this.locked = !this.locked;
        },
    },
};
</script>

<style scoped>
.day-label {
    margin-bottom: 16px;
    text-align: center;
}
</style>
