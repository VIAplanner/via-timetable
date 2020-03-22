<template>
  <v-autocomplete v-model="value" :items="items" dense label="Search Course"></v-autocomplete>
</template>

<script>
export default {
  name: "course-search-bar",
  data() {
    return {
      items: ["foo", "bar", "fizz", "buzz"],
      value: null
    };
  }
};
</script>

<style>
</style>