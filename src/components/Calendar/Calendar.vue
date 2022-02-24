<template>
  <v-row class="fill-height">
    <v-col class="ma-0 pt-6 pb-0 pl-9 pr-9">
      <v-row>
        <v-col>
          <v-sheet height="64">
            <v-toolbar
              flat
            >
              <!-- 
              add assessment menu includes the add 
              assessment button and the pop up dialog menu 
              -->
              <add-assessment-menu />
              <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
              >
                Today
              </v-btn>
              <v-btn
                fab
                text
                small
                color="grey darken-2"
                @click="prev"
              >
                <v-icon small>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn
                fab
                text
                small
                color="grey darken-2"
                @click="next"
                class="mr-4"
              >
                <v-icon small>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu
                bottom
                right
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="grey darken-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <span>{{ typeToLabel[getType] }}</span>
                    <v-icon right>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="setType({'type': 'day'})">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="setType({'type': 'week'})">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="setType({'type': 'month'})">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="setType({'type': '4day'})">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <v-sheet class="pl-2" :height="calendarHeight">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="getCalendarEvents"
              :event-color="getEventColor"
              :type="getType"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="getSelectedElement"
              offset-x
            >
              <v-card
                color="grey lighten-4"
                min-width="350px"
                flat
              >
                <v-toolbar :color="getSelectedEvent.color" dark>
                  <v-toolbar-title v-html="getSelectedEvent.name"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn class="mr-1" icon @click="deleteEvent(getSelectedEvent)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <span v-html="getSelectedEvent.details"></span>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    text
                    color="secondary"
                    @click="setSelectedOpen(false)"
                  >
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';
import AddAssessmentMenu from './AddAssessmentMenu.vue';

export default {
  components: {
    AddAssessmentMenu,
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  computed: {
    ...mapGetters([
      'getFocus',
      'getType',
      'getSelectedEvent',
      'getSelectedElement',
      'getSelectedOpen',
      'getCalendarEvents',
    ]),
    focus: {
      get() {
        return this.getFocus
      },
      set(value) {
        this.setFocus(value)
      },
    },
    selectedOpen: {
      get() {
        return this.getSelectedOpen
      },
      set(value) {
        this.setSelectedOpen(value)
      },
    },
    calendarHeight() {
      return this.height - 144;
    },
  },
  data() {
    return {
      height: window.innerHeight,
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
    }
  },
  mounted () {
    this.$refs.calendar.checkChange()
  },
  methods: {
    ...mapMutations([
      'setToday',
      'setType',
      'setSelectedOpen',
      'setFocus',
      'viewDay',
      'showEvent',
      'updateRange',
      'deleteEvent',
    ]),
    handleResize() {
      this.height = window.innerHeight;
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    getEventColor (event) {
      return event.color
    },
  },
}
</script>