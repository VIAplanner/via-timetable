<template>
	<div class="overflow-y-scroll noScrollbar">
		<div class="heroSection flex flex-col items-center text-white">
			<h1 class="font-bold md:text-8xl lg:text-8xl pt-8 pb-6 text-6xl">VIAplanner</h1>
			<h2 class="font-medium text-3xl pb-3 px-4 md:px-8">University of Toronto course planning made easier</h2>
			<Button label="Start Building" @click="$router.push('/timetable')" rounded size="large"
				class="py-3 m-4 mb-4" :pt:root:class="'bg-green-400 border-green-400'" />
			<div class="flex flex-col md:flex-row w-3/4 mb-2 justify-center items-center gap-x-8 gap-y-8 sm:w-1/2">
				<Button label="GitHub" rounded class="w-5 max-w-40" @click="openGitHub" />
			</div>
			<div>
				<h3 class="text-2xl flex flex-row items-center pt-4">
					<span class="pi pi-star-fill pr-2 text-yellow-400 text-3xl"></span>
					<span>{{ starCount }}</span>
				</h3>
			</div>
			<div
				class="w-[92%] sm:w-5/6 md:w-3/4 lg:w-1/2 max-w-3xl justify-center mb-8 text-center backdrop-blur-lg p-4 rounded-2xl">
				<h2 class="font-medium mb-1 text-xl">
					About Us
				</h2>
				<p class="text-lg px-2 sm:px-0">
					VIAplanner is a tool designed by students at the University of Toronto to help the community.
					We desire to enhance the course selection process. Currently, course selection is a tedious, manual
					process that can take days to perfect. With VIAplanner, we are modernizing the course
					selection process and making it easier to respond to timetable changes and make effective schedules
					personalized to you.
					<br>
					<br>
					VIAplanner uses course and divisional data scraped from official University of Toronto resources.
					The data is updated once per day, so the numbers shown on the site may differ slightly from actual
					values
					<br>
					<br>
					VIAplanner is open-source and student maintained. If you wish to contribute your skills to better
					the enrolment process with us, consult our
					<u><a href="https://github.com/VIAplanner/" target="_blank">GitHub Repository</a></u>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const starCount = ref(0)

onMounted(async () => {
	await fetchStarCount();
})

/**
 * @brief Opens the VIAplanner GitHub page in a new tab
 */
function openGitHub() {
	window.open('https://github.com/VIAplanner', '_blank', 'noopener,noreferrer');
}

/**
 * @brief Updates the starCount ref with the number of GitHub stars the repo has
 */
async function fetchStarCount() {
	await axios
		.get('https://api.github.com/repos/VIAplanner/via-timetable')
		.then(res => {
			starCount.value = res.data.stargazers_count;
		})
		.catch(err => {
			console.error('Error fetching stargazers count:', err)
		});
}
</script>

<style scoped>
.heroSection {
	background-image: url('../assets/about-background.jpg');
	min-height: 100vh;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}
</style>