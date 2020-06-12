<template>
    <v-speed-dial
        v-model="fab"
        right
        bottom
        fixed
        direction="top"
        open-on-hover
        transition="scale-transition"
    >
        <template v-slot:activator>
            <v-btn v-model="fab" color="#012B5C" dark fab>
                <v-icon v-if="fab">mdi-close</v-icon>
                <v-icon v-else>mdi-hammer-screwdriver</v-icon>
            </v-btn>
        </template>
        <v-btn fab dark small color="orange">
            <v-icon>mdi-teach</v-icon>
        </v-btn>
        <v-btn fab dark small color="blue" @click="$router.push({ name: 'about' })">
            <v-icon>mdi-information</v-icon>
        </v-btn>
    </v-speed-dial>
</template>

<script>
export default {
    data() {
        return {
            fab: false,
        };
    },
};
</script>
