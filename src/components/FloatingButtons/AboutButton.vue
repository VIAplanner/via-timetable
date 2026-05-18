<template>
	<div>
		<Button @click="router.push('/about')" icon="pi pi-info" rounded v-tooltip.left="tooltip('About Us')"
			:pt:root:class="'bg-blue-500 border-blue-500 text-white'" class="shadow-md" />
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip';

const router = useRouter();
const { tooltip } = useResponsiveTooltip();
</script>
