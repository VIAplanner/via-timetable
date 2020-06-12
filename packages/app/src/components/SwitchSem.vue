<template>
    <div>
        <toggle-button
            v-model="toggle"
            :labels="{ checked: 'Fall', unchecked: 'Winter' }"
            :color="{ checked: '#F26B83', unchecked: '#4C91F9' }"
            :font-size="15"
            :width="93"
            :height="40"
            :speed="150"
            sync
        />
    </div>
</template>

<script>
import { ToggleButton } from "vue-js-toggle-button";
import { mapGetters, mapMutations } from "vuex";

export default {
    computed: {
        ...mapGetters(["getSemesterStatus"]),
        toggle: {
            get() {
                return this.getSemesterStatus === "F";
            },
            set(value) {
                if (value) {
                    this.setSemesterStatus("F");
                } else {
                    this.setSemesterStatus("S");
                }
            },
        },
    },
    components: {
        ToggleButton,
    },
    methods: {
        ...mapMutations(["setSemesterStatus", "setSearchBarValue"]),
    },
    // watch: {
    //     // when toggle changes, clear the search bar
    //     toggle(){
    //         this.setSearchBarValue(null)
    //     }
    // }
};
</script>

<style>
.v-left {
    margin-left: 11px;
}
</style>
