<template>
    <v-app>
        <v-content>
            <v-app-bar app dark color="#012B5C">
                <v-icon class="mr-2">mdi-calendar</v-icon>
                <v-toolbar-title class="mr-4">Timetable Planner</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn text href="https://uoftcoursetools.tech/" target="blank">
                    <v-icon left>mdi-file-document</v-icon>
                    Docs
                </v-btn>
                <v-btn
                    text
                    href="https://github.com/UTM-Hacklab/UofTCourseTools"
                    target="blank"
                >
                    <v-icon left>mdi-github</v-icon>
                    GitHub
                </v-btn>
            </v-app-bar>
            <v-container fluid>
                <v-row>
                    <v-col cols="7">
                        <div style="text-align:center">
                            <v-img
                                class="center"
                                src="../assets/img1.png"
                                max-width="800"
                            ></v-img>
                        </div>
                    </v-col>
                    <v-col>
                        <v-row align="center" style="height: 450px;">
                            <div>
                                <h1>Your timetable,</h1>
                                <h1 style="margin-bottom: 40px">Via us</h1>
                                <h3 style="margin-bottom: 40px">
                                    Have you always dreaded making your timetable?
                                    Scowering through Acorn deperstatly trying to fit
                                    together your courses? Well, we built a solution
                                    for that. Through just a few clicks, our
                                    timetable generator will be able to provide you
                                    an ideal schedule. Just select your courses, and
                                    we will take care of the rest!
                                </h3>
                                <v-btn dark large color="#012B5C">
                                    Try it Now
                                </v-btn>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
export default {};
</script>

<style scoped>
.center {
    margin-left: auto;
    margin-right: auto;
}
</style>
