<template>
    <div>
        <v-row>
            <v-col class="py-0" style="text-align: center">
                <v-toolbar dark color="#012B5C">
                    <v-icon class="mr-2">mdi-calendar</v-icon>
                    <v-toolbar-title class="mr-4">Timetable Planner</v-toolbar-title>
                </v-toolbar>
                <h1 style="margin-top:50px; margin-bottom: 60px">
                    Mobile View In Progress
                </h1>
                <v-avatar size="300">
                    <v-img
                        src="https://media.giphy.com/media/3o85xA30i7z1LUIISY/giphy.gif"
                    ></v-img>
                </v-avatar>
                <v-row style="margin-top: 60px">
                    <v-col>
                        <div style="margin-bottom: 20px">
                            <v-btn
                                width="300"
                                height="50"
                                color="#00A1FF"
                                dark
                                @click="$router.push({name: 'about'})"
                            >
                                <v-icon left dark>mdi-information</v-icon>
                                About
                            </v-btn>
                        </div>
                        <div style="margin-bottom: 20px">
                            <v-btn
                                width="300"
                                height="50"
                                color="#012B5C"
                                dark
                                href="https://github.com/UTM-Hacklab/UofTCourseTools"
                                target="_blank"
                            >
                                <v-icon left dark>mdi-github</v-icon>
                                Github
                            </v-btn>
                        </div>
                        <div>
                            <v-btn
                                width="300"
                                height="50"
                                color="#69C673"
                                dark
                                href="https://uoftcoursetools.tech/"
                                target="_blank"
                            >
                                <v-icon left dark>mdi-file-document</v-icon>
                                API Docs
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>