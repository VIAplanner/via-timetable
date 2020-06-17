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
        <about-btn></about-btn>
        <tutorial-btn></tutorial-btn>
    </v-speed-dial>
</template>

<script>
import TutorialBtn from "../components/TutorialBtn"
import AboutBtn from "../components/AboutBtn"
export default {
    components:{
        TutorialBtn,
        AboutBtn
    },
    data() {
        return {
            fab: false,
        };
    },
};
</script>
