<template>
    <v-dialog v-model="getConflictPopup" persistent max-width="290">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Warning
            </v-card-title>
            <v-card-text
                >We are unable to generate a possible timetable based on changes you made. We
                will roll back to your previous timetable</v-card-text
            >
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="setConflictPopup(false)">
                    I understand
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
    computed: {
        ...mapGetters(["getConflictPopup"]),
    },
    methods: {
        ...mapMutations(["setConflictPopup"]),
    },
};
</script>
