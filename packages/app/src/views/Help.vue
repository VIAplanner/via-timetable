<template>
    <v-app>
        <v-content style="background-color: #F3F3F3">
            <v-app-bar app dark color="#012B5C">
                <v-toolbar-title class="display-1 font-regular">
                    Viaplanner
                    <span class="title font-weight-light"
                        >at the University of Toronto</span
                    >
                </v-toolbar-title>
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
            <v-container fluid >
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
                    <v-col cols="4">
                        <v-row align="center" style="height: 450px;">
                            <div>
                                <h1>Making Your Timetable,</h1>
                                <h1 style="margin-bottom: 40px">
                                    Should Never Be a Chore
                                </h1>
                                <h3 style="margin-bottom: 40px" class="font-weight-medium">
                                    Have you always dreaded making your timetable?
                                    Searching through Acorn desperately trying to fit
                                    together your courses? Well, we built a solution
                                    for that. Through just a few clicks, our
                                    timetable generator will provide you an ideal
                                    schedule. Just select your courses, and we will
                                    take care of the rest!
                                </h3>
                                <v-btn
                                    class="text-none"
                                    dark
                                    large
                                    color="#012B5C"
                                    @click="$router.push({ name: 'home' })"
                                >
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
