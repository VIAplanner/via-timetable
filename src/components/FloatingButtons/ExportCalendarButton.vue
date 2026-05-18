<template>
	<div>
		<Button @click="exportTimetables()" rounded icon="pi pi-download"
			v-tooltip.left="tooltip('Export Timetables')" :pt:root:class="'text-white'" />

		<div v-if="exportSemester" aria-hidden="true" class="export-template-stage">
			<ExportTimetableTemplate :semester="exportSemester" :timetable="store.timetables[exportSemester]"
				:title="exportTitle" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, Ref } from 'vue';
import html2canvas from 'html2canvas';
import { useTimetableStore } from '../../store/timetable';
import ExportTimetableTemplate from './ExportTimetableTemplate.vue';
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip';
import { FIRST_SEM, SECOND_SEM } from '../../store/timetable.shared';

const store = useTimetableStore() as any;
const { tooltip } = useResponsiveTooltip();
const exportSemester: Ref<string | null> = ref(null);
const exportTitle: Ref<string> = ref('');

/**
 * @brief Converts a semester code and list of session groups into the subsession within the currently selected session
 * group
 * @param sessions The list of session groups
 * @param semester The semester code
 */
function getSemesterTitle(sessions: Array<any>, semester: string): string {
	const sessionGroup = sessions.find((group: any) => group.group === store.selectedSessionGroup);

	if (!sessionGroup) return "";

	const sessionKey = ` (${semester})`;
	const subsession = sessionGroup.subsessions.find((entry: any) => entry.label.includes(sessionKey));

	return subsession ? subsession.label.replace(sessionKey, '') : "";
}

/**
 * @brief Downloads the given canvas into a PNG
 * @param canvas The canvas to download
 * @param filename The filename of the PNG
 */
function downloadCanvas(canvas: any, filename: string) {
	const link = document.createElement('a');
	link.href = canvas.toDataURL('image/png');
	link.download = filename;
	link.click();
}

/**
 * @brief Downloads the timetable for a given semester
 * @param semester The semester code
 * @param title The title that should be displayed on the downloaded timetable
 */
async function captureSemester(semester: string, title: string) {
	store.selectedSession = semester;
	exportSemester.value = semester;
	exportTitle.value = title;

	await nextTick();
	await new Promise(resolve => requestAnimationFrame(resolve));
	await nextTick();

	const elementId = `exportTemplate-${semester}`;
	const timetableElement = document.getElementById(elementId);

	if (!timetableElement) return;

	const canvas = await html2canvas(timetableElement, {
		backgroundColor: '#ffffff',
		useCORS: true,
		scale: 2
	});

	downloadCanvas(canvas, `ViaPlanner-${semester}.png`);
}

/**
 * @brief Downloads all semesters timetables that have at least one event in them
 */
async function exportTimetables() {
	// Export all semesters that have at least one selected course.
	const originalSession = store.selectedSession;
	const semestersToExport = [FIRST_SEM, SECOND_SEM].filter(
		(semester) => Object.keys(store.selectedCourses[semester] || {}).length > 0
	);

	if (!semestersToExport.length) return;

	try {
		const sessions = await store.getSessions();

		for (const semester of semestersToExport) {
			const semesterTitle = getSemesterTitle(sessions, semester);
			await captureSemester(semester, semesterTitle);
		}
	} finally {
		exportSemester.value = null;
		exportTitle.value = '';
		store.selectedSession = originalSession;
	}
}
</script>

<style scoped>
.export-template-stage {
	position: fixed;
	left: -10000px;
	top: 0;
	pointer-events: none;
	display: flex;
	flex-direction: column;
	gap: 24px;
}
</style>