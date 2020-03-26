<template>
  <v-list rounded subheader two-line flat>
      <v-subheader>Lectures</v-subheader>
      <v-list-item-group multiple>
        <v-list-item v-for="lecture in lectures" :key="lecture.code">
          <v-list-item-content>
            <v-list-item-title>{{lecture.code}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-title>{{lecture.location}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-title>{{lecture.instructors[0]}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-radio></v-radio>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
      <v-subheader v-if="tutorials.length > 0">Tutorials</v-subheader>
      <v-list-item-group v-if="tutorials.length > 0" multiple>
        <v-list-item v-for="tutorial in tutorials" :key="tutorial.code">
          <v-list-item-content>
            <v-list-item-title>{{tutorial.code}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-title>{{tutorial.location}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-title>{{tutorial.instructors[0]}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-radio></v-radio>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
      <v-subheader>Practicals</v-subheader>
      <v-list-item-group multiple>
        <v-list-item v-for="practical in practicals" :key="practical.code">
          <v-list-item-content>
            <v-list-item-title>{{practical.code}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-title>{{practical.location}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-title>{{practical.instructors[0]}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-radio></v-radio>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: "course-selection-picker",
  computed: {
    lectures() {
      return this.course.meeting_sections.filter(
        section => section.code.charAt(0) === "L"
      );
    },
    tutorials() {
      return this.course.meeting_sections.filter(
        section => section.code.charAt(0) === "T"
      );
    },
    practicals() {
      return this.course.meeting_sections.filter(
        section => section.code.charAt(0) === "P"
      );
    }
  },
  data() {
    return {
      lecture: "",
      course: {
        code: "CSC108H5F",
        name: "Introduction to Computer Programming",
        description:
          "Structure of computers; the computing environment. Programming in a language such as Python. Program structure: elementary data types, statements, control flow, functions, classes, objects, methods, fields. List: searching, sorting and complexity. [36L, 24P]",
        campus: "UTM",
        meeting_sections: [
          {
            code: "L0107",
            instructors: ["M Liut"],
            times: [
              {
                day: "WEDNESDAY",
                start: 64800,
                end: 75600,
                duration: 10800,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0108",
            instructors: ["P Vrbik"],
            times: [
              {
                day: "TUESDAY",
                start: 64800,
                end: 75600,
                duration: 10800,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "P0119",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 61200,
                end: 68400,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0120",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0121",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0122",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0123",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0124",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 61200,
                end: 68400,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "L0101",
            instructors: ["A Petersen"],
            times: [
              {
                day: "MONDAY",
                start: 32400,
                end: 36000,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "WEDNESDAY",
                start: 32400,
                end: 36000,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 32400,
                end: 36000,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0102",
            instructors: ["A Petersen"],
            times: [
              {
                day: "MONDAY",
                start: 36000,
                end: 39600,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "WEDNESDAY",
                start: 36000,
                end: 39600,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 36000,
                end: 39600,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0103",
            instructors: ["P Vrbik"],
            times: [
              {
                day: "MONDAY",
                start: 39600,
                end: 43200,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "WEDNESDAY",
                start: 39600,
                end: 43200,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 39600,
                end: 43200,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0104",
            instructors: ["Arsala Bangash"],
            times: [],
            size: 120,
            enrolment: 0
          },
          {
            code: "L0105",
            instructors: ["V Maccio"],
            times: [
              {
                day: "MONDAY",
                start: 50400,
                end: 54000,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "WEDNESDAY",
                start: 50400,
                end: 54000,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 50400,
                end: 54000,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0106",
            instructors: ["M Liut"],
            times: [
              {
                day: "MONDAY",
                start: 43200,
                end: 46800,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "WEDNESDAY",
                start: 43200,
                end: 46800,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 43200,
                end: 46800,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "P0101",
            instructors: [],
            times: [
              {
                day: "MONDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0102",
            instructors: [],
            times: [
              {
                day: "MONDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0103",
            instructors: [],
            times: [
              {
                day: "MONDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0104",
            instructors: [],
            times: [
              {
                day: "MONDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0105",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0106",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0107",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0108",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0109",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 61200,
                end: 68400,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0110",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0111",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0112",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0113",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0114",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 61200,
                end: 68400,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 20,
            enrolment: 0
          },
          {
            code: "P0115",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0116",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0117",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0118",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          }
        ]
      },
      active: false
    };
  }
};
</script>

<style>
</style>