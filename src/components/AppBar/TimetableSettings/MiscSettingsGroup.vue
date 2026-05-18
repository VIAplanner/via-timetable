<template>
    <div class="flex flex-row flex-wrap items-center justify-between">
        <OnlinePreferenceSelect />
        <IncludeUnavailableSwitch />
        <AvoidRushHourSwitch />
    </div>
</template>

<script setup>
import OnlinePreferenceSelect from './OnlinePreferenceSelect.vue';
import IncludeUnavailableSwitch from './IncludeUnavailableSwitch.vue';
import AvoidRushHourSwitch from './AvoidRushHourSwitch.vue';
</script>