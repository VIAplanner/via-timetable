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
                    API Docs
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
                    <v-col cols="7" class="pb-0">
                        <div style="text-align:center">
                            <v-img
                                class="center"
                                src="../assets/img1.png"
                                max-width="800"
                            ></v-img>
                        </div>
                    </v-col>
                    <v-col cols="4" class="pb-0">
                        <v-row align="center" style="height: 450px;">
                            <div>
                                <h1>Making Your Timetable,</h1>
                                <h1 style="margin-bottom: 40px">
                                    Should Never Be a Chore
                                </h1>
                                <h3
                                    style="margin-bottom: 40px"
                                    class="font-weight-medium"
                                >
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
                <v-row
                    style="background-color: #FCFCFC"
                    justify="center"
                    class="pt-12"
                >
                    <v-col cols="5" class="pb-0">
                        <v-row align="center" justify="end" style="height: 450px;">
                            <div style="text-align: right">
                                <h3>Generate</h3>
                                <h1 style="margin-bottom: 20px">
                                    Schedule Automatically
                                </h1>
                                <h3 class="font-weight-medium">
                                    Simply choose the course on the search bar
                                </h3>
                                <h3
                                    style="margin-bottom: 40px;"
                                    class="font-weight-medium"
                                >
                                    and we will make a timetable for you
                                </h3>
                            </div>
                        </v-row>
                    </v-col>
                    <v-col class="pb-0">
                        <div style="text-align:center">
                            <v-img
                                class="center"
                                src="../assets/img2.gif"
                                max-width="800"
                            ></v-img>
                        </div>
                    </v-col>
                </v-row>
                <v-row justify="center" class="pt-12">
                    <v-col class="pb-0">
                        <div style="text-align:center">
                            <v-img
                                class="center"
                                src="../assets/img3.gif"
                                max-width="800"
                            ></v-img>
                        </div>
                    </v-col>
                    <v-col cols="5" class="pb-0">
                        <v-row align="center" justify="start" style="height: 450px;">
                            <div>
                                <h3>Flexibility</h3>
                                <h1 style="margin-bottom: 20px">
                                    Block Times Off
                                </h1>
                                <h3 class="font-weight-medium">
                                    Can't go to school on Mondays?
                                </h3>
                                <h3
                                    style="margin-bottom: 40px;"
                                    class="font-weight-medium"
                                >
                                    Just block that day off and we will reschedule
                                </h3>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row justify="center" style=" background-color: #FCFCFC">
                    <v-col style="text-align: center" cols="8">
                        <h1 class="ma-3">Features</h1>
                        <v-carousel show-arrows-on-hover>
                            <v-carousel-item
                                v-for="(path, text) in slideData"
                                :key="text"
                            >
                                <v-sheet color="white">
                                    <v-row>
                                        <v-col>
                                            <p style="color: black">
                                                {{ text }}
                                            </p>
                                            <v-img class="center" :src="path" />
                                        </v-col>
                                    </v-row>
                                </v-sheet>
                            </v-carousel-item>
                        </v-carousel>
                    </v-col>
                </v-row>
                <v-row justify="center" align="center" style="height: 400px">
                    <v-col style="text-align: center" cols="5">
                        <h1>Open Source</h1>
                        <h3 class="font-weight-medium ma-5">
                            This is a platform built for students, by students.
                            Universities can't always keep up with the cutting-edge,
                            but we have made it our mission to do so.
                        </h3>
                        <h3 class="font-weight-medium">
                            That's why we need your help. At Viaplanner, we are
                            strong believer in collaboration. Thus, we've decided to
                            display all of our source code. If you have any idea that
                            you think would be useful, please don't hesitate to make
                            it happen.
                        </h3>
                        <v-btn
                            href="https://uoftcoursetools.tech/"
                            target="blank"
                            dark
                            color="#012B5C"
                            class="ma-4"
                        >
                            <v-icon left>mdi-file-document</v-icon>
                            API Docs
                        </v-btn>
                        <v-btn
                            href="https://github.com/UTM-Hacklab/UofTCourseTools"
                            target="blank"
                            color="#7C007C"
                            dark
                            class="ma-4"
                        >
                            <v-icon left>mdi-github</v-icon>
                            GitHub
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            slideData: {
                "Generate Timetable: no need to select your own times": require("../assets/slide1.gif"),
                "Switch Sections: complete control over your schedule": require("../assets/slide2.gif"),
                "Block Times: can't go to class during a time? Just block it": require("../assets/slide3.gif"),
                "Lock Sections: lock specific sections and we won't touch it": require("../assets/slide4.gif"),
            },
        };
    },
};
</script>

<style scoped>
.center {
    margin-left: auto;
    margin-right: auto;
}
</style>
