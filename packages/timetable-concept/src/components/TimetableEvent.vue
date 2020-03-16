<template>
  <div>
    <div v-if="event.start > 0">
      <div
        class="event"
        :class="durationClass(event.start, event.end)"
        :style=" { background: color }"
      >
        <h4
          style="margin-bottom:3px;"
        >{{event.courseCode.substring(0, event.courseCode.length - 1)}}</h4>
        <div>{{event.section}}</div>
        {{getFormattedTime(event.start, event.end)}}
      </div>
    </div>
    <div class="event empty-event one-hour" v-else></div>
  </div>
</template>

<script>
const convertSecondsToHours = (seconds) => {
  return seconds / 3600;
}
export default {
  name: "timetable-event",
  props: {
    event: {
      type: Object,
      default: () => {}
    },
    color: {
        type: String, 
        default: "#83CC77"
    }
  },
  methods: {
    durationClass(start, end) {
      const duration = convertSecondsToHours(end - start);
      if (duration === 1) {
        return "one-hour";
      } else if (duration === 2) {
        return "two-hours";
      } else if (duration === 3) {
        return "three-hours";
      }
    },
    getFormattedTime(start, end) {
      return `${(start / 3600) % 12}:00 - ${(end / 3600) % 12}:00`;
    }
  }
};
</script>

<style scoped>
.event {
  border: 0.2px solid gray;
  color: white;
  padding: 8px;
}
.empty-event {
  background: white !important;
  border: 0.2px solid gray;
}
.one-hour {
  height: 84px;
}

.two-hours {
  height: 168px;
}

.three-hours {
  height: 252px;
}
</style>