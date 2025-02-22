<template>
  <div class='pl-1 pr-3'>
    <v-btn
      @click='()=>setDarkMode($vuetify.theme.dark = !$vuetify.theme.dark)'
      icon
    >
      <v-tooltip bottom>
        <template v-slot:activator='{ on, attrs }'>
          <v-icon v-bind='attrs' v-on='on'>
            {{ !$vuetify.theme.dark ? 'mdi-lightbulb' : 'mdi-brightness-4' }}
          </v-icon>
        </template>
        <span>Change theme</span>
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations(['setDarkMode']),
  },
};
</script>
<style>
.v-left {
  margin-left: 11px;
}
</style>
