<template>
    <v-autocomplete
        ref="searchBarComponent"
        @change="onCourseSelected"
        v-model="selectedCourse"
        :items="allCourses"
        class="mx-4"
        flat
        hide-no-data
        hide-details
        :placeholder="!loading ? 'Search for a Course' : 'Loading . . .'"
        :loading="loading"
        :autofocus="false"
        solo-inverted
    ></v-autocomplete>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import axios from "axios";

export default {
    data() {
        return {
            loading: true,
            allCourses: [],
        };
    },
    async mounted() {
        let rawCourses = [];

        try {
            rawCourses = await axios.get(
                `${process.env.VUE_APP_API_BASE_URL}/courses/searchbar?api_key=${process.env.VUE_APP_API_KEY}`
            );
            rawCourses = rawCourses.data;
        } catch (e) {
            console.log(e.message);
        }

        if (rawCourses.length != 0) {
            rawCourses.sort((a, b) => {
                if (a.courseCode < b.courseCode) {
                    return -1;
                } else {
                    return 1;
                }
            });

            this.allCourses = rawCourses.map((course) => {
                if (course.courseCode[8] === "F") {
                    return `🍂   ${course.courseCode}: ${course.name}`;
                } else if (course.courseCode[8] === "S") {
                    return `❄️   ${course.courseCode}: ${course.name}`;
                } else {
                    return `🍂❄️ ${course.courseCode}: ${course.name}`;
                }
            });
        }

        this.loading = false;
    },
    computed: {
        ...mapGetters(["getSearchBarValue", "getSemesterStatus", "selectedCourses"]),
        selectedCourse: {
            // used as v-model for the search bar
            get() {
                return this.getSearchBarValue;
            },
            set(value) {
                this.setSearchBarValue(value);
            },
        },
        semCourses() {
            return this.allCourses.filter((courseString) => {
                // filter out all summer courses
                return courseString[14] === ":";
            });
        },
    },
    methods: {
        ...mapActions(["selectCourse"]),
        ...mapMutations(["setSearchBarValue", "setSemesterStatus"]),
        async onCourseSelected() {
            if (!this.selectedCourse) return;

            // Switch the semester based on the course
            if (this.selectedCourse[13] === "F") {
                this.setSemesterStatus("F");
            } else {
                this.setSemesterStatus("S");
            }

            // Checks if the course is already added
            for (let courseCode in this.selectedCourses) {
                if (this.selectedCourse.includes(courseCode)) return;
            }

            // unfocus the search bar
            this.$refs.searchBarComponent.blur();
            this.loading = true;

            let course = {};
            let courseCode = this.selectedCourse.slice(
                5,
                this.selectedCourse.indexOf(":")
            );

            try {
                course = await axios.get(
                    `${process.env.VUE_APP_API_BASE_URL}/courses/${courseCode}?api_key=${process.env.VUE_APP_API_KEY}`
                );
                course = course.data;
            } catch (e) {
                console.log(e.message);
            }

            if (course) {
                this.selectCourse({ course });
            }

            this.loading = false;
        },
    },
};
</script>
