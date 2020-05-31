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
        loadingParent: Boolean,
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
                // filter out all summer courses
                return courseString[9] === ":";
            });
        },
        loading: {
            get(){
                return this.loading
            },
            set(value){
                this.loading = value
            }
        }
    },
    methods: {
        ...mapActions(["selectCourse"]),
        ...mapMutations(["setSearchBarValue", "setSemesterStatus"]),
        onCourseSelected() {
            if (!this.selectedCourse) return;

            if (this.selectedCourse[8] === "F") {
                this.setSemesterStatus("F");
            } else {
                this.setSemesterStatus("S");
            }

            // Checks if the course is already added
            for (let courseCode in this.selectedCourses) {
                if (this.selectedCourse.includes(courseCode)) return;
            }

            this.loading = true;

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
                    this.loading = false;
                });
        },
    },
};
</script>

<style></style>
