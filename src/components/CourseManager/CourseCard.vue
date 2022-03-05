<template>
    <div class="course-card">
        <button>{{ courseCode }}</button>
        <p>{{ name }}</p>
        <button>A</button>
        <button>B</button>
        <button>C</button>
        <button>D</button>
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        courseCode: String
    }
}
</script>

<style scoped>

.course-card {
    min-height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

</style>