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
        :loading="false"
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
            loading: false,
            allCourses: [],
        };
    },
    async mounted() {
        let rawCourses = [];

        console.log(`${process.env.VUE_APP_API_BASE_URL}/courses/searchbar`)

        try {
            rawCourses = await axios.get(
                `${process.env.VUE_APP_API_BASE_URL}/courses/searchbar`
            );
        } catch (e) {
            console.log(e);
        }

        if (rawCourses.length != 0) {
            return [];
        }
        this.allCourses = this.rawCourses.map((course) => {
            if (course.code[8] === "F") {
                return `🍂   ${course.code}: ${course.name}`;
            } else if (course.code[8] === "S") {
                return `❄️   ${course.code}: ${course.name}`;
            } else {
                return `🍂❄️ ${course.code}: ${course.name}`;
            }
        });
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
        onCourseSelected() {
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

            // this.$apollo
            //     .query({
            //         query: gql`
            //             query getCourse($code: String!) {
            //                 courses(code: $code) {
            //                     courseCode: code
            //                     name
            //                     meeting_sections {
            //                         sectionCode: code
            //                         instructors
            //                         times {
            //                             day
            //                             start
            //                             end
            //                             location
            //                         }
            //                     }
            //                 }
            //             }
            //         `,
            //         variables: {
            //             code: this.selectedCourse.slice(
            //                 5,
            //                 this.selectedCourse.indexOf(":")
            //             ),
            //         },
            //     })
            //     .then((response) => {
            //         if (response.data.courses) {
            //             this.selectCourse({ course: response.data.courses[0] });
            //         }
            //         this.loading = false;
            //     });
        },
    },
};
</script>

<style></style>
