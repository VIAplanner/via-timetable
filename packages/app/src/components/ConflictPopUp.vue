<template>
    <v-row justify = "center">
        <v-dialog v-model = "conflictDialog" persistent max-width = "290">
            <v-card>
                <v-card-title>Warning</v-card-title>
                <v-card-text>We are unable to generate a possible timetable based on changes 
                    you made. We will roll back to your previous timetable</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color = "green darken-1" text @click="dialog = false">I understand</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    name: "conflict-timetable-popup",
}
</script>