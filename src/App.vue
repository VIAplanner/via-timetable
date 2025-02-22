<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<style lang='scss'>
#app {
  max-width: 100%;
  overflow: hidden;
}

.theme--dark.v-application {
  * {
    color: #fffffaaa !important;
  }
}

// Make sure text input boxes is visible on dark theme
.theme--dark.v-text-field--solo-inverted.v-input--is-focused > .v-input__control > .v-input__slot input {
    color: rgba(0, 0, 0, 0.87)!important;
}

.v-toolbar__content,
.v-toolbar__extension {
  padding-left: 10px !important;
  padding-right: 0px !important;
}
</style>
