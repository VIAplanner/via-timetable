<template>
  <Button
    icon="pi pi-book"
    label="View Legend"
    size="small"
    :pt:icon:class="'text-white'"
    :pt:label:class="'text-white'"
    @click="visible = true"
  />
  <Dialog
    v-model:visible="visible"
    modal
    :show-header="true"
    :style="{ maxWidth: '100vw', padding: '1rem' }"
    :header="`${division} Divisional Legend`"
  >
    <div class="divisionalLegendPopup" v-html="content"></div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'

const visible: Ref<boolean> = ref(false)

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  division: {
    type: String,
    required: true,
  },
})
</script>

<style>
.divisionalLegendPopup table {
  border-spacing: 1rem 0;
  border-collapse: separate;
}

.divisionalLegendPopup {
  font-size: 14px;
}

.divisionalLegendPopup caption {
  display: none;
}

.divisionalLegendPopup h4 {
  margin: 0;
}

.divisionalLegendPopup td {
  vertical-align: top;
  margin-right: 1rem;
  min-width: 10rem;
}
</style>
