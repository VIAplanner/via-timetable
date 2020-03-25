<template>
  <v-container>
    <v-row>
      <v-col>
        <course-search-bar v-if="!$apollo.loading" :courses="formattedCourses" />
      </v-col>
    </v-row>
    <v-row style="background: #E5E5E5;">
      <v-col>
        <timetable :timetable="timetable" :courseCodeColorMap="courseCodeColorMap" />
      </v-col>
    </v-row>
    <v-row style="background: #E5E5E5;">
      <v-col>
        <TimetableCourseCard
          v-for="(courseInfo, courseCode) in formattedCoursesForCourseCards"
          :key="courseCode"
          :course="courseInfo"
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
  computed: {
    formattedCourses() {
      return this.courses.map(course => `${course.code}: ${course.name}`);
    },
    courseCodeColorMap() {
      const codeColorMap = new Map();
      var index = 0;
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          if (!codeColorMap.has(event.courseCode)) {
            codeColorMap.set(event.courseCode, this.colors[index]);
            index++;
          }
        }
      }
      return codeColorMap;
    },
    formattedCoursesForCourseCards() {
      const result = {};
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          //If result doesn't already have event.courseCode
          if (!(event.courseCode in result)) {
            result[event.courseCode] = {
              codeAndName: this.getFormattedCodeAndName(
                event.courseCode,
                event.courseName
              ),
              color: this.courseCodeColorMap.get(event.courseCode),
              meetingSections: [
                {
                  section: event.section,
                  day: day,
                  start: event.start,
                  end: event.end,
                  location: event.location,
                  instructorName: event.instructorName
                }
              ]
            };
          } else {
            result[event.courseCode].meetingSections.push({
              section: event.section,
              day: day,
              start: event.start,
              end: event.end,
              location: event.location,
              instructorName: event.instructorName
            });
          }
        }
      }
      console.log(result)
      return result;
    }
  },
  data() {
    return {
      colors: ["#FBB347", "#83CC77", "#4C91F9", "#F26B83", "#5CD1EB"],
      timetable: {
        Monday: [
          {
            courseCode: "CSC258H5S",
            courseName: "Computer Organizaion",
            section: "L0101",
            start: 32400,
            end: 39600,
            location: "IB 345",
            instructorName: "Andrew Petersen"
          },
          {
            courseCode: "STA258H5S",
            courseName: "Statistics with Prob",
            section: "L0101",
            start: 54000,
            end: 61200,
            location: "MN 1210",
            instructorName: "Alvaro Nosedal Sanchez"
          }
        ],
        Tuesday: [
          {
            courseCode: "CSC207H5S",
            courseName: "Software Design",
            section: "L0101",
            start: 39600,
            end: 46800,
            location: "MN 1270",
            instructorName: "Arnold Rosenbloom"
          },
          {
            courseCode: "CSC258H5S",
            courseName: "Computer Organizaion",
            section: "P0109",
            start: 61200,
            end: 64800,
            location: "DH 2026",
            instructorName: "TBA"
          }
        ],
        Wednesday: [
          {
            courseCode: "CSC290H5S",
            courseName: "Communication Skills for CSC",
            section: "L0101",
            start: 50400,
            end: 57600,
            location: "MN 1270",
            instructorName: "Paul Virbik"
          },
          {
            courseCode: "STA258H5S",
            courseName: "Statistics with Prob",
            section: "T0105",
            start: 61200,
            end: 64800,
            location: "DH 2080",
            instructorName: "TBA"
          }
        ],
        Thursday: [
          {
            courseCode: "CSC290H5S",
            courseName: "Communication Skills for CSC",
            section: "T0101",
            start: 39600,
            end: 46800,
            location: "MN 1270",
            instructorName: "TBA"
          },
          {
            courseCode: "CSC209H5S",
            courseName: "Soft Tools & Sys Prog",
            section: "P0111",
            start: 61200,
            end: 64800,
            location: "DH 2026",
            instructorName: "TBA"
          }
        ],
        Friday: [
          {
            courseCode: "CSC209H5S",
            courseName: "Soft Tools & Sys Prog",
            section: "L0104",
            start: 50400,
            end: 57600,
            location: "MN 1270",
            instructorName: "Andrew Petersen"
          }
        ]
      }
    };
  },
  apollo: {
    courses: COURSES_SEARCH_BAR_QUERY
  },
  methods: {
    getFormattedCodeAndName(code, name) {
      return `${code} ${name}`;
    }
  }
};
</script>
