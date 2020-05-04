<template>
    <v-dialog width="390" v-model="optimizationOpen">
        <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">
                <v-icon md>mdi-settings-outline</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Optimization Settings
                <v-spacer></v-spacer>
                <v-btn icon @click="optimizationOpen = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-actions>
                <v-container fluid>
                    <v-row justify="start" align="center">
                        <h4 style="margin: 10px">Idle Time:</h4>
                        <v-btn-toggle v-model="selectedIdleOption">
                            <v-btn
                                v-for="option in idleOptions"
                                :key="option"
                                :color="option.color"
                                outlined
                                small
                            >
                                {{ option.text }}
                            </v-btn>
                        </v-btn-toggle>
                    </v-row>
                    <v-row justify="start" align="center">
                        <h4 style="margin: 10px">Days Off:</h4>
                        <v-btn-toggle v-model="selectedDaysOptions" multiple style="margin-left: 5px">
                            <v-btn
                                v-for="option in daysOptions"
                                :key="option"
                                outlined
                                small
                                width="53.4"
                            >
                                {{ option }}
                            </v-btn>
                        </v-btn-toggle>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "optimization-settings",
    data() {
        return {
            optimizationOpen: false,
            idleOptions: [
                { text: "Minimize", color: "#F26B83" },
                { text: "Netural", color: "#FBB347" },
                { text: "Maximize", color: "#83CC77" },
            ],
            daysOptions: ["MO", "TU", "WE", "TH", "FR"],
            selectedIdleOption: 1,
            selectedDaysOptions: [],
        };
    },
};
</script>
