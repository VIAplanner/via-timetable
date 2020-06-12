<template>
    <v-dialog v-model="dialog" width="600" persistent>
        <v-card>
            <v-card-title style="background-color: #012B5C;">
                <p class="headline ma-0" style="color: white">
                    Welcome to VIAplanner!
                </p>
                <v-spacer></v-spacer>
                <v-btn icon large @click="dialog = false" color="white">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-carousel hide-delimiter-background show-arrows-on-hover height="480">
                <v-carousel-item v-for="tut in allTut" :key="tut.step">
                    <v-sheet
                        style="border-radius: 0px"
                        :color="tut.backgroundColor"
                        height="100%"
                    >
                        <v-row class="ma-0" style="width: 600px">
                            <v-col>
                                <p class="text-h5 ml-3 mb-0">{{ tut.step }}</p>
                                <p class="text-h4 ml-3">{{ tut.title }}</p>
                                <v-img eager :src="tut.path"></v-img>
                                <p class="text-h6 ml-3 mb-0 mt-4 text-center">
                                    {{ tut.description }}
                                </p>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-carousel-item>
            </v-carousel>
        </v-card>
    </v-dialog>
</template>

<script>
import genColor from "color-generator";
export default {
    mounted() {
        if (!localStorage.visited) {
            localStorage.visited = true;
        }
    },
    data() {
        return {
            dialog: !localStorage.visited && !this.$isMobile(),
            allTut: [
                {
                    step: "Step 1",
                    title: "Select some courses",
                    path: require("../assets/tut1.gif"),
                    description:
                        "Just click on a course and we will generate a timetable",
                    backgroundColor: genColor(0.7, 0.85).hexString(),
                },
                {
                    step: "Step 2",
                    title: "Adjust your times",
                    path: require("../assets/tut2.gif"),
                    description:
                        "Click on the pencil icon or the course itself to adjust the times",
                    backgroundColor: genColor(0.7, 0.85).hexString(),
                },
                {
                    step: "Step 3",
                    title: "Select and lock",
                    path: require("../assets/tut3.gif"),
                    description: "Lock times in place and we won't change it",
                    backgroundColor: genColor(0.7, 0.85).hexString(),
                },
                {
                    step: "Step 4",
                    title: "Switch between semesters",
                    path: require("../assets/tut4.gif"),
                    description:
                        "Click on the top right to switch between fall and winter",
                    backgroundColor: genColor(0.7, 0.85).hexString(),
                },
            ],
        };
    },
};
</script>
