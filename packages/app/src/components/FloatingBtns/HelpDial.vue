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
            <v-btn v-model="fab" color="#012B5C" dark small fab>
                <v-icon v-if="fab">mdi-close</v-icon>
                <v-icon v-else>mdi-hammer-screwdriver</v-icon>
            </v-btn>
        </template>
        <export-btn></export-btn>
        <about-btn></about-btn>
        <tutorial-btn></tutorial-btn>
    </v-speed-dial>
</template>

<script>
import TutorialBtn from "./TutorialBtn";
import AboutBtn from "./AboutBtn";
import ExportBtn from "./ExportBtn";

export default {
    components: {
        TutorialBtn,
        AboutBtn,
        ExportBtn,
    },
    data() {
        return {
            fab: false,
        };
    },
};
</script>
