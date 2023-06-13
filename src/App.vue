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
 .theme--dark>* {
    color: #fffffaaa !important;

   //&::after, &::before {
   //  content: " ";
   //  width: 1em;
   //  height: 1em;
   //  display: block;
   //  background-image: url("");
   //}
  }



.v-toolbar__content,
.v-toolbar__extension {
  padding-left: 10px !important;
  padding-right: 0px !important;
}
</style>
