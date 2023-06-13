<template>
  <v-dialog v-model='getShareLinkPopup' persistent max-width='690'>
    <v-card>
      <v-card-title
        class='white--text align-end cardTitle'
        primary-title
        style='background: #012B5C'
      >
        <v-row class='fill-height ml-1 mb-1' justify='start' align='center'>
          Info
        </v-row>
      </v-card-title>
      <v-card-text class='text--primary'>
        <div class='textStyle'>
          You can share this link with your friends
          and it will be saved for the next 90 days.<br>
          <v-tooltip :value='showTooltip' top>
            <template v-slot:activator='{ on, attrs }'>
              <v-container style='padding: 0;margin: 0;' v-bind='attrs'
                           v-on='on' @click='copyText'>
                <v-text-field
                  readonly
                  ref='shareLinkInput'
                  :value='`https://timetable.viaplanner.ca/timetable?timetable=${getShareLink}`'>
                </v-text-field>
              </v-container>
            </template>
            {{ showTooltip ? 'Copied!' : 'Copy' }}
          </v-tooltip>

        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color='blue darken-1' text @click='setShareLinkPopup(false)'>
          I understand
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      showTooltip: false,
    };
  },
  computed: {
    ...mapGetters(['getShareLinkPopup', 'getShareLink']),
  },
  methods: {
    ...mapMutations(['setShareLinkPopup']),
    copyText() {
      this.$refs.shareLinkInput.$el.querySelector('input').focus();
      console.log(this.$refs.shareLinkInput.$el.querySelector('input'));
      this.$refs.shareLinkInput.$el.querySelector('input').select();
      this.showTooltip = true;
      navigator.clipboard.writeText(
        `https://timetable.viaplanner.ca/timetable?timetable=${this.getShareLink}`,
      );
      setTimeout(() => {
        this.showTooltip = false;
      }, 1000);
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
