<template>
    <v-app>
        <v-content style="background-color: #FEFEFE" class="pt-0">
            <v-app-bar
                fixed
                elevation="0"
                dark
                class="pa-0"
                :style="
                    top
                        ? 'background-color: transparent'
                        : 'background-color: #012B5C'
                "
            >
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
                    href="https://docs.viaplanner.ca/"
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
            <v-container fluid class="pb-0 pt-0">
                <v-row>
                    <v-col class="pa-0">
                        <v-parallax
                            id="top-image"
                            src="../assets/about-background.jpg"
                            :height="windowHeight"
                            v-if="!$isMobile()"
                        >
                            <v-row align="center" justify="center">
                                <v-col class="text-center" cols="12">
                                    <h1
                                        class="text-h2 ma-4"
                                        v-intersect="onIntersect"
                                    >
                                        Course Selection Made Easy
                                    </h1>
                                    <h1
                                        class="text-h5 ma-4"
                                        style="font-weight: 300"
                                    >
                                        We are a tool for tailoring your University
                                        timetable based on your programs
                                    </h1>
                                    <v-btn
                                        rounded
                                        color="white"
                                        x-large
                                        outlined
                                        style="text-transform: none; border-width: medium"
                                        class="ma-4"
                                        @click="$router.push({ name: 'home' })"
                                    >
                                        Try out the Alpha
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-parallax>
                        <v-img
                            id="top-image"
                            src="../assets/about-background.jpg"
                            :height="windowHeight"
                            v-else
                        >
                            <v-row
                                align="center"
                                justify="center"
                                class="fill-height"
                            >
                                <v-col class="text-center" cols="12">
                                    <h1
                                        class="text-h2 ma-4"
                                        v-intersect="onIntersect"
                                        style="color: white"
                                    >
                                        Course Selection Made Easy
                                    </h1>
                                    <h1
                                        class="text-h5 ma-4"
                                        style="font-weight: 300; color: white"
                                    >
                                        We are a tool for tailoring your University
                                        timetable based on your programs
                                    </h1>
                                    <v-btn
                                        rounded
                                        color="white"
                                        x-large
                                        outlined
                                        style="text-transform: none; border-width: medium"
                                        class="ma-4"
                                        @click="$router.push({ name: 'home' })"
                                    >
                                        Try out the Alpha
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-img>
                    </v-col>
                </v-row>
                <v-card elevation="4" class="mt-4">
                    <v-row justify="center">
                        <v-col cols="12" lg="5" class="pb-0" order="2" order-lg="1">
                            <v-row
                                align="center"
                                :justify="$isMobile() ? 'center' : 'end'"
                                class="fill-height"
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
                                    :class="$isMobile() ? ['center', 'ma-3'] : ['center', 'mt-3', 'mb-7']"
                                    src="../assets/img2.gif"
                                    max-width="800"
                                ></v-img>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card elevation="4" class="mt-4">
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
                                <div
                                    :style="$isMobile() ? 'text-align: center' : ''"
                                >
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
                                        Just block that day off and we will
                                        reschedule
                                    </h3>
                                </div>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card elevation="4" class="mt-4">
                    <v-row justify="center">
                        <v-col style="text-align: center">
                            <h1 class="ma-3">Features</h1>
                            <v-carousel
                                show-arrows-on-hover
                                :height="$isMobile() ? 350 : 600"
                            >
                                <v-carousel-item
                                    v-for="(path, text) in slideData"
                                    :key="text"
                                    class="pa-3"
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
                </v-card>
                <v-row justify="center" align="center" style="min-height: 400px">
                    <v-col style="text-align: center" cols="12" lg="6">
                        <h1>Open Source</h1>
                        <h3 class="text-body-1 ma-5">
                            This is a platform built for students, by students.
                            Universities can't always keep up with the
                            <strong>cutting-edge</strong>
                            technologies, but we have made it our mission to do so.
                        </h3>
                        <h3 class="text-body-1">
                            That's why we need your help. At VIAplanner, we are
                            strong believer in <strong>collaboration</strong>. Thus,
                            we've decided to display all of our source code. If you
                            have any ideas that you think would be useful, please
                            don't hesitate to
                            <strong>make it happen.</strong>
                        </h3>
                        <div class="mt-5">
                            <v-btn
                                href="https://docs.viaplanner.ca/"
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
            top: false,
            slideData: {
                "Generate Timetable: no need to select your own times": require("../assets/slide1.gif"),
                "Switch Sections: complete control over your schedule": require("../assets/slide2.gif"),
                "Block Times: can't go to class during a time? Just block it": require("../assets/slide3.gif"),
                "Lock Sections: lock specific sections and we won't change it": require("../assets/slide4.gif"),
                "Switch Semesters: easily switch between your timetables": require("../assets/slide5.gif"),
            },
        };
    },
    computed: {
        windowHeight() {
            return window.innerHeight;
        },
    },
    methods: {
        onIntersect(entries) {
            this.top = entries[0].isIntersecting;
        },
    },
};
</script>

<style>
.center {
    margin-left: auto;
    margin-right: auto;
}
</style>
