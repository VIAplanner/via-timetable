<template>
    <v-row @mouseover="hovered = true" @mouseleave="hovered = false">
        <v-tooltip left v-if="hovered">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-if="hovered"
                    fab
                    dark
                    small
                    color="green"
                    @click="exportTimetables"
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon>mdi-download</v-icon>
                </v-btn>
            </template>
            <span>Export Timetables</span>
        </v-tooltip>
        <v-btn v-else fab dark small color="green">
            <v-icon>mdi-information</v-icon>
        </v-btn>
    </v-row>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            hovered: true,
            exportURL: null,
        };
    },
    methods: {
        async exportTimetables() {
            const el = document.querySelector("#exportMe")
            const options = {
                type: "dataURL",
            };

            try {
                this.exportURL = await this.$html2canvas(el, options);
            } catch (error) {
                console.log("conversion error");
            }

            this.downloadWithAxios();
        },

        forceFileDownload(response) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "file.png"); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.pop();
        },
        async downloadWithAxios() {
            try {
                let response = await axios({
                    method: "get",
                    url: this.exportURL,
                    responseType: "arraybuffer",
                });
                this.forceFileDownload(response);
            } catch (error) {
                console.log("Download Failed");
            }
        },
    },
};
</script>
