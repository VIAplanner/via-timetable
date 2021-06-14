<template>
  <v-dialog v-model="getOverwriteLockedSectionPopup" persistent max-width="290">
    <v-card>
      <v-card-title
        class="white--text align-end cardTitle"
        primary-title
        style="background: #012B5C"
      >
        <v-row class="fill-height ml-1 mb-1" justify="start" align="center">
          Warning
        </v-row>
      </v-card-title>
      <v-card-text class="text--primary">
        <div class="textStyle">
          You are trying to overwrite a section that is currently locked, do you
          want to unlock it and proceed?
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="onClickProceed">
          Proceed
        </v-btn>
        <v-btn color="blue darken-1" text @click="onClickCancel">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getOverwriteLockedSectionPopup']),
  },
  methods: {
    ...mapMutations(['setOverwriteLockedSectionPopup']),
    onClickProceed() {
      this.$emit('Proceed');
      this.setOverwriteLockedSectionPopup(false);
    },
    onClickCancel() {
      this.$emit('Cancel');
      this.setOverwriteLockedSectionPopup(false);
    },
  },
};
</script>

<style>
.cardTitle {
  padding: 25px;
}
.textStyle {
  margin-top: 20px;
}
</style>
