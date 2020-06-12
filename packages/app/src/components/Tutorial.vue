<template>
    <v-dialog v-model="dialog" width="600" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                Click Me
            </v-btn>
        </template>

        <v-card>
            <v-card-title style="background-color: #012B5C;">
                <p class="headline ma-0" style="color: white">
                    Welcome to VIAplanner!
                </p>
                <v-spacer></v-spacer>
                <v-btn fab small @click="dialog = false" color="red lighten-1">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-carousel>
                <v-carousel-item>
                    <v-sheet style="border-radius: 0px" color="blue" height="100%">
                        <v-row class="ma-0" style="width: 600px">
                            <v-col>
                                <p class="text-lg-h1">Step 1</p>
                                <p>Search for a course</p>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-carousel-item>
            </v-carousel>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialog: true,
        };
    },
};
</script>
