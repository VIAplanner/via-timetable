<template>
    <v-autocomplete
        @change="onCourseSelected()"
        v-model="selectedCourse"
        :items="courses"
        cache-items
        class="mx-4"
        flat
        hide-no-data
        hide-details
        :label="!loading ? 'Search for a Course' : 'Loading...'"
        solo-inverted
        :loading="loading"
    ></v-autocomplete>
</template>

<script>
import { mapActions } from "vuex";
import gql from "graphql-tag";
export default {
    name: "course-search-bar",
    props: {
        loading: Boolean,
        courses: Array,
    },
    methods: {
        ...mapActions(["selectCourse"]),
        onCourseSelected() {
            if (!this.selectedCourse) return;
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
                    // console.log(response);
                    if (response.data.courses) {
                        this.selectCourse({ course: response.data.courses[0] });
                    }
                });
        },
    },
    data() {
        return {
            selectedCourse: null,
        };
    },
};
</script>

<style></style>
