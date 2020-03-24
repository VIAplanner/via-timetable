<template>
  <v-container>
    <v-row>
      <v-col>
        <course-search-bar v-if="!$apollo.loading" :courses="formattedCourses" />
      </v-col>
    </v-row>
    <v-row style="background: #E5E5E5;">
      <v-col>
        <timetable :timetable="timetable" />
      </v-col>
    </v-row>
    <v-row style="background: #E5E5E5;">
      <v-col>
        <TimetableCourseCard
          v-for="(info, course) in courseCards"
          :key="course"
          :codeAndName="info.codeAndName"
          :color="info.color"
          :meetingSections="info.meetingSections"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CourseSearchBar from "../components/CourseSearchBar";
import Timetable from "../components/Timetable";
import TimetableCourseCard from "../components/TimetableCourseCard";
import COURSES_SEARCH_BAR_QUERY from "../graphql/CoursesSearchBar.gql";

export default {
  components: {
    CourseSearchBar,
    Timetable,
    TimetableCourseCard
  },
  data() {
    return {
      courseCards: {
        CSC258H5S: {
          codeAndName: "CSC258H5 S Computer Organizaion",
          color: "#FBB347",
          meetingSections: [
            {
              instructorName: "Andrew Petersen",
              day: "Monday",
              section: "L0101",
              start: 32400,
              end: 39600,
              location: "IB 345"
            },
            {
              section: "P0109",
              instructorName: "TBA",
              day: "Tuesday",
              start: 61200,
              end: 64800,
              location: "DH 2026"
            }
          ]
        },
        STA258H5S: {
          codeAndName: "STA258H5 S Statistics with Prob",
          color: "#83CC77",
          meetingSections: [
            {
              instructorName: "Alvaro Nosedal Sanchez",
              day: "Monday",
              section: "L0101",
              start: 54000,
              end: 61200,
              location: "MN1210"
            },
            {
              instructorName: "TBA",
              day: "Wednesday",
              section: "T0105",
              start: 61200,
              end: 64800,
              location: "DH 2080"
            }
          ]
        },
        CSC207H5S: {
          codeAndName: "CSC207H5 S Software Design",
          color: "#4C91F9",
          meetingSections: [
            {
              instructorName: "Arnold Rosenbloom",
              day: "Tuesday",
              section: "L0101",
              start: 39600,
              end: 46800,
              location: "MN 1270"
            }
          ]
        },
        CSC290H5S: {
          codeAndName: "CSC290H5 S Communication Skills for CSC",
          color: "#F26B83",
          meetingSections: [
            {
              instructorName: "Paul Virbik",
              day: "Wednesday",
              section: "L0101",
              start: 50400,
              end: 57600,
              location: "MN 1270"
            },
            {
              instructorName: "TBA",
              day: "Thursday",
              section: "T0101",
              start: 39600,
              end: 46800,
              location: "MN 1270"
            }
          ]
        },
        CSC209H5S: {
          codeAndName: "CSC209H5 S Soft Tools & Sys Prog",
          color: "#5CD1EB",
          meetingSections: [
            {
              instructorName: "Andrew Perersen",
              day: "Friday",
              section: "L0104",
              start: 50400,
              end: 57600,
              location: "MN 1270"
            },
            {
              instructorName: "TBA",
              day: "Thursday",
              section: "P0111",
              start: 61200,
              end: 64800,
              location: "DH 2026"
            }
          ]
        }
      },
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
      }
    };
  },
  apollo: {
    courses: COURSES_SEARCH_BAR_QUERY
  },
  computed: {
    formattedCourses() {
      return this.courses.map(course => `${course.code}: ${course.name}`);
    }
  }
};
</script>
