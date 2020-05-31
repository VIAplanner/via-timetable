<template>
    <v-autocomplete
        @change="onCourseSelected()"
        v-model="selectedCourse"
        :items="semCourses"
        class="mx-4"
        flat
        hide-details
        :label="!loading ? 'Search for a Course' : 'Loading . . .'"
        solo-inverted
        :loading="loading"
    ></v-autocomplete>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import gql from "graphql-tag";
export default {
    name: "course-search-bar",
    props: {
        loading: Boolean,
        allCourses: Array,
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
                // filter courses in the selected sem
                return courseString[8] === this.getSemesterStatus && courseString[9] === ":";
            });
        },
    },
    methods: {
        ...mapActions(["selectCourse"]),
        ...mapMutations(["setSearchBarValue"]),
        onCourseSelected() {
            if (!this.selectedCourse) return;

            // Checks if the course is already added
            for(let courseCode in this.selectedCourses){
                if(this.selectedCourse.includes(courseCode)) return;
            }

            this.$apollo
                .query({
                    query: gql`
                        query getCourse($code: String!) {
                            courses(code: $code) {
                                courseCode: code
                                name
                                meeting_sections {
                                    sectionCode: code
                                    instructors
                                    times {
                                        day
                                        start
                                        end
                                        location
                                    }
                                }
                            }
                        }
                    `,
                    variables: {
                        code: this.selectedCourse.slice(
                            0,
                            this.selectedCourse.indexOf(":")
                        ),
                    },
                })
                .then((response) => {
                    if (response.data.courses) {
                        this.selectCourse({ course: response.data.courses[0] });
                    }
                });
        },
    },
};
</script>

<style></style>
