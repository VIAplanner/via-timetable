<template>
  <v-tooltip color='warning' class='warning warning--text' top>
    <template v-slot:activator='{ on, attrs }'>
      <v-icon color='warning' v-bind='attrs' v-on='on'>mdi-alert</v-icon>
    </template>
    <span>
          {{ warningText || 'This section is not open for enrollment at the moment' }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'warning',
  props: {
    warningText: {
      type: String,
      required: false,
    },
  },
};
</script>