<template>
  <v-row>
    <v-col>
      <v-sheet :height="managerHeight">
        <calendar-heatmap 
          class="pa-9"
          :values="getHeatMapEvents"
          :endDate="endDate"
          tooltip-unit="deadlines"
          :max="max"
          :tooltip="false"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  data() {
    return {
      height: window.innerHeight,
      max: 4,
      endDate: new Date()
    }
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight;
    },
  },
  computed: {
    ...mapGetters([
      'getCalendarEvents',
    ]),
    getHeatMapEvents() {
      
      const events = this.getCalendarEvents
      const eventsObject = {}
      for (let i = 0; i < events.length; i += 1) {
        const datetime = new Date(events[i].start)
        const year = datetime.getFullYear() - 1
        const month = datetime.getMonth() + 1
        const day = datetime.getDate()
        const date = `${year}-${month}-${day}`
        if (!(date in eventsObject)) {
          eventsObject[date] = 0
        }
        eventsObject[date] += 1
      }
      const eventsList = []
      for (const key in eventsObject) {
        eventsList.push({date: key, count: eventsObject[key]})
      }
      return eventsList
    },
    managerHeight() {
      return this.height - 104;
    },
  },
}
</script> 