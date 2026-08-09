<template>
  <div>
    <Button
      v-tooltip.left="tooltip('About Us')"
      icon="pi pi-info"
      rounded
      :pt:root:class="'bg-blue-500 border-blue-500 text-white'"
      class="shadow-md"
      aria-label="About Us"
      @click="router.push('/about')"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip'

const router = useRouter()
const { tooltip } = useResponsiveTooltip()
</script>
