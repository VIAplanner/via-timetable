<template>
    <div class="relative h-auto my-5">
        <hr class="border-text-primary">
        <h2
            class="absolute top-1/2 transform -translate-y-1/2 m-0 left-8 pb-1 px-3 bg-timetablesettings-background font-semibold text-text-primary">
            {{ text }}
        </h2>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        default: "Text Here"
    }
})
</script>