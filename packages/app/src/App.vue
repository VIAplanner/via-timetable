<template>
    <v-app>
        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

<script>
export default {
    created() {
        if (this.$isMobile()) {
            this.$router.push("mobile");
        }
    },
};
</script>
<style>
html, body {
    max-width: 100%;
    overflow-x: hidden;
}
</style>
