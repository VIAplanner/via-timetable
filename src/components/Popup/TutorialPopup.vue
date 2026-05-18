<template>
	<div>
		<Dialog @close="dialogClosed" v-model:visible="visible" modal header="Welcome to VIAplanner!"
			:style="dialogStyle">
			<div style="max-height:90vh; overflow:auto; padding:0.5rem;">
				<Carousel :value="tutorialSteps" :numVisible="1" :numScroll="1">
					<template #item="slotProps">
						<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
							<h2 class="text-lg font-bold">{{ slotProps.data.step }}: {{ slotProps.data.title }}</h2>
							<p>{{ slotProps.data.description }}</p>
							<div class="mb-4" style="width:100%;display:flex;justify-content:center;">
								<div :style="getImageStyle(slotProps.data.path)"></div>
							</div>
						</div>
					</template>
				</Carousel>
			</div>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, computed } from 'vue';
import { useTimetableStore } from '../../store/timetable';
import { useWindowSize } from '../../composables/useWindowSize';

// @ts-ignore
import genColor from 'color-generator';

import desktop1 from '../../assets/tutorial/tutorial_desktop_1.gif';
import desktop2 from '../../assets/tutorial/tutorial_desktop_2.gif';
import desktop3 from '../../assets/tutorial/tutorial_desktop_3.gif';
import desktop4 from '../../assets/tutorial/tutorial_desktop_4.gif';
import desktop5 from '../../assets/tutorial/tutorial_desktop_5.gif';
import desktop6 from '../../assets/tutorial/tutorial_desktop_6.gif';
import desktop7 from '../../assets/tutorial/tutorial_desktop_7.gif';

import mobile1 from '../../assets/tutorial/tutorial_mobile_1.gif';
import mobile2 from '../../assets/tutorial/tutorial_mobile_2.gif';
import mobile3 from '../../assets/tutorial/tutorial_mobile_3.gif';
import mobile4 from '../../assets/tutorial/tutorial_mobile_4.gif';
import mobile5 from '../../assets/tutorial/tutorial_mobile_5.gif';
import mobile6 from '../../assets/tutorial/tutorial_mobile_6.gif';
import mobile7 from '../../assets/tutorial/tutorial_mobile_7.gif';

const store = useTimetableStore() as any;

const visible: Ref<boolean> = ref(store.tutorialPopup);

watch(() => store.tutorialPopup, (val: boolean) => {
	if (val !== visible.value) visible.value = val;
});

watch(visible, (val: boolean) => {
	if (store.tutorialPopup !== val) store.tutorialPopup = val;
});

const { isSmallDevice } = useWindowSize();

const imageSets = {
	desktop: [desktop1, desktop2, desktop3, desktop4, desktop5, desktop6, desktop7],
	mobile: [mobile1, mobile2, mobile3, mobile4, mobile5, mobile6, mobile7],
};

const titles = [
	"Choose your sessions and divisions",
	"Select your courses",
	"Choose specific sections",
	"Block and lock timeslots and sections",
	"Switch between semesters",
	"Adjust your ideal timetable settings",
	"Export your timetable",
];

const descriptions = [
	"Choose the section you are building for, and the divisions you want to choose courses in",
	"Use the quick add button to add the course automatically rebuild your timetable",
	"You can manually choose sections if you prefer specific ones",
	"You can block hours, days, specific timeslots, and sections for courses",
	"You can cycle between the first and second semester of the session by using the toggle on the navbar",
	"Explore a large assortment of options to make your timetable more personalized to your needs",
	"Export your timetables as a PNG using the export button on the help dial",
];

const tutorialSteps = computed(() => {
	const imgs = isSmallDevice.value ? imageSets.mobile : imageSets.desktop;
	return imgs.map((path, idx) => ({
		step: `Step ${idx + 1}`,
		title: titles[idx] ?? `Step ${idx + 1}`,
		path,
		description: descriptions[idx] ?? '',
		backgroundColor: genColor(0.7, 0.85).hexString(),
	}));
});

const dialogStyle = computed(() => {
	if (isSmallDevice.value) {
		return {
			width: '100vw',
			height: '100vh',
			'max-width': '100vw',
			'max-height': '100vh',
			margin: '0',
			padding: '0',
		};
	}
	return { 'width': 'auto', 'max-width': 'min(1200px, 100vw)' };
});

const imageHeight = computed(() => (isSmallDevice.value ? '66vh' : '60vh'));

function getImageStyle(path: string) {
	return {
		width: '100%',
		height: imageHeight.value,
		backgroundImage: `url(${path})`,
		backgroundSize: isSmallDevice.value ? 'auto 102%' : '100% auto',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	} as Record<string, string>;
}

function dialogClosed() {
	store.tutorialPopup = false;
}
</script>