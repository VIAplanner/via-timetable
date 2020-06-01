<template>
    <v-autocomplete
        ref="searchBarComponent"
        @change="onCourseSelected"
        v-model="selectedCourse"
        :items="semCourses"
        class="mx-4"
        flat
        hide-no-data
        hide-details
        hide-selected
        :placeholder="!loading ? 'Search for a Course' : 'Loading . . .'"
        :loading="loading"
        :autofocus="false"
        solo-inverted
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
    data(){
        return {
            loadingChild: false
        }
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
                return courseString[12] === ":";
            });
        },
        loading: {
            get(){
                return this.loadingParent || this.loadingChild
            },
            set(value){
                this.loadingChild = value
            }
        }
    },
    methods: {
        ...mapActions(["selectCourse"]),
        ...mapMutations(["setSearchBarValue", "setSemesterStatus"]),
        onCourseSelected() {
            if (!this.selectedCourse) return;

            // Switch the semester based on the course
            if (this.selectedCourse[11] === "F") {
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
                            3,
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
