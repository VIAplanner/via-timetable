<template>
  <div class="pl-1 pr-3">
    <v-btn
      @click='()=>$vuetify.theme.dark = !$vuetify.theme.dark'
      icon
    ><v-icon>{{!$vuetify.theme.dark ? "mdi-lightbulb" : "mdi-brightness-4"}}</v-icon></v-btn>
  </div>
</template>

<style>
.v-left {
  margin-left: 11px;
}
</style>
