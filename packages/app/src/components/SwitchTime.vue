<template>
    <div>
        <toggle-button
            v-model="toggle"
            :labels="{ checked: 'Fall', unchecked: 'Winter' }"
            :color="{ checked: '#F26B83', unchecked: '#4C91F9' }"
            :font-size="14"
            :width="83"
            :height="30"
            :speed="150"
        />
    </div>
</template>

<script>
import { ToggleButton } from "vue-js-toggle-button";

export default {
    data() {
        return {
            toggle: true,
        };
    },
    components: {
        ToggleButton,
    },
};
</script>

<style>
.v-left {
    margin-left: 11px;
}
</style>
