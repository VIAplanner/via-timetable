<template>
    <v-dialog v-model="getConflictPopup" persistent max-width="290">
        <v-card>
            <v-img height="75px" :src="logo">
                <v-card-title class="white--text align-end cardTitle" primary-title>
                    Warning
                </v-card-title>
            </v-img>
            <v-card-text class="text--primary">
                <div class="textStyle"
                    v-if="properties.timetableMessage"
                >
                    We are unable to generate a possible timetable based on changes you
                    made. We will roll back to your previous timetable.
                </div>
                <div class="textStyle"
                    v-if="properties.lockMessage"
                >
                    You are switching to a course section that is currently locked, do you want to
                    override a locked section?
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-if="properties.understandBTN"
                    color="blue darken-1"
                    text
                    @click="setConflictPopup(false)"
                    >
                    I understand
                    </v-btn>
                <v-btn
                    v-if="properties.yesLock"
                    color="blue darken-1"
                    text
                    @click="setConflictPopup(false)"
                    >
                    Yes
                </v-btn>
                <v-btn
                    v-if="properties.noLock"
                    color="blue darken-1"
                    text
                    @click="setConflictPopup(false)"
                    >
                    No
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
    props: {
        properties: Object
    },
    data() {
        return {
            logo: require("../assets/barbackground.png"),
        };
    },
    computed: {
        ...mapGetters(["getConflictPopup"]),
        
    },
    methods: {
        ...mapMutations(["setConflictPopup"]),
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
/* .buttonStyle{
  min-width:0px;
} */
</style>
