<template>
    <v-app>
        <v-content style="background-color: #F3F3F3" class="pt-0">
            <v-app-bar app dark color="#012B5C" class="pa-0">
                <v-img
                    src="../assets/VIA-Planner-White.png"
                    :max-width="$isMobile() ? 100 : 130"
                    contain
                    @click="$router.push({ name: 'home' })"
                    style="cursor: pointer"
                />
                <v-spacer></v-spacer>
                <v-btn
                    text
                    href="https://docs.google.com/forms/d/e/1FAIpQLScmmk0H3_5KVxoa6m74_Uj93dF-2OCUQF-kPXcr9xki8V71oQ/viewform"
                    target="blank"
                >
                    <v-icon left>mdi-text-box-check-outline</v-icon>
                    Survey
                </v-btn>
                <v-btn
                    v-if="!$isMobile()"
                    text
                    href="https://uoftcoursetools.tech/"
                    target="blank"
                >
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
                <v-row :justify="$isMobile() ? 'center' : 'start'">
                    <v-col cols="12" lg="7" md="7" class="pb-0">
                        <div style="text-align:center">
                            <v-img
                                class="center"
                                src="../assets/img1.png"
                                max-width="800"
                            ></v-img>
                        </div>
                    </v-col>
                    <v-col cols="11" lg="4" md="4" class="pb-0">
                        <v-row align="center" style="min-height: 450px">
                            <div style="text-align: center">
                                <h1>Making Your Timetable,</h1>
                                <h1 style="margin-bottom: 40px">
                                    Should Never Be a Chore
                                </h1>
                                <h3
                                    style="margin-bottom: 20px"
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
                                    class="text-none mb-1"
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
                    style="background-color: #FEFEFE"
                    justify="center"
                    class="pt-12"
                >
                    <v-col cols="12" lg="5" class="pb-0" order="2" order-lg="1">
                        <v-row
                            align="center"
                            :justify="$isMobile() ? 'center' : 'end'"
                            style="min-height:450px"
                        >
                            <div
                                :style="
                                    $isMobile()
                                        ? 'text-align: center'
                                        : 'text-align: right'
                                "
                            >
                                <h3>Generate</h3>
                                <h1 style="margin-bottom: 20px">
                                    Schedule Automatically
                                </h1>
                                <h3 class="font-weight-medium">
                                    Simply choose a course on the search bar
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
                    <v-col cols="12" lg="7" class="pb-0" order="1" order-lg="2">
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
                    <v-col class="pb-0" cols="12" lg="7">
                        <div style="text-align:center">
                            <v-img
                                class="center"
                                src="../assets/img3.gif"
                                max-width="800"
                            ></v-img>
                        </div>
                    </v-col>
                    <v-col cols="11" lg="5" class="pb-0">
                        <v-row
                            align="center"
                            :justify="$isMobile() ? 'center' : 'start'"
                            style="min-height: 430px;"
                        >
                            <div :style="$isMobile() ? 'text-align: center' : ''">
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
                <v-row justify="center" style="background-color: #FEFEFE;">
                    <v-col style="text-align: center">
                        <h1 class="ma-3">Features</h1>
                        <v-carousel
                            show-arrows-on-hover
                            :height="$isMobile() ? 350 : 600"
                        >
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
                <v-row justify="center" align="center" style="min-height: 400px">
                    <v-col style="text-align: center" cols="12" lg="5">
                        <h1>Open Source</h1>
                        <h3 class="font-weight-medium ma-5">
                            This is a platform built for students, by students.
                            Universities can't always keep up with the cutting-edge
                            technologies, but we have made it our mission to do so in
                            order to deliver the best.
                        </h3>
                        <h3 class="font-weight-medium">
                            That's why we need your help. At VIAPlanner, we are
                            strong believer in collaboration. Thus, we've decided to
                            display all of our source code. If you have any ideas
                            that you think would be useful, please don't hesitate to
                            make it happen.
                        </h3>
                        <div class="mt-3">
                            <v-btn
                                href="https://uoftcoursetools.tech/"
                                target="blank"
                                dark
                                color="#012B5C"
                            >
                                <v-icon left>mdi-file-document</v-icon>
                                API Docs
                            </v-btn>
                            <v-btn
                                href="https://github.com/UTM-Hacklab/UofTCourseTools"
                                target="blank"
                                color="#7C007C"
                                dark
                                class="ma-1"
                            >
                                <v-icon left>mdi-github</v-icon>
                                GitHub
                            </v-btn>
                            <v-btn
                                href="https://docs.google.com/forms/d/e/1FAIpQLScmmk0H3_5KVxoa6m74_Uj93dF-2OCUQF-kPXcr9xki8V71oQ/viewform"
                                target="blank"
                                color="#00A1FF"
                                dark
                            >
                                <v-icon left>mdi-text-box-check-outline</v-icon>
                                Survey
                            </v-btn>
                        </div>
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
                "Lock Sections: lock specific sections and we won't change it": require("../assets/slide4.gif"),
                "Switch Semesters: easily switch between your timetables": require("../assets/slide5.gif"),
            },
        };
    },
};
</script>

<style>
.center {
    margin-left: auto;
    margin-right: auto;
}
</style>
