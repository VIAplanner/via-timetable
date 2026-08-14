<template>
  <div class="m-2">
    <label class="block mb-0 text-sm font-bold">
      {{ label }}
      <!-- eslint-disable vue/attribute-hyphenation -->
      <Select
        v-model="internalValue"
        :options="times"
        option-label="display"
        option-value="numerical"
        filter
        :pt:root:class="'border-transparent hover:border-active w-30 font-normal shadow-md!'"
        :pt:overlay:class="'border-none'"
        :pt:option:class="'TimeSettingOption'"
        :pt:pcFilter:root:class="'text-text-primary rounded-sm focus-within:outline-none caret-text-primary pl-3 py-2 bg-content-hover-background'"
      />
      <!-- eslint-enable vue/attribute-hyphenation -->
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { TIMES } from '../../../types/constants.types'

const times = ref([...TIMES])

const props = withDefaults(
  defineProps<{
    output: number
    label?: string
    defaultValue?: number
  }>(),
  { label: 'Enter time', defaultValue: 9 },
)

const emit = defineEmits<{
  'update:output': [value: number]
}>()

const internalValue = ref(props.output ?? props.defaultValue)

watch(internalValue, (val) => {
  emit('update:output', val)
})
</script>

<style>
.TimeSettingOption:hover {
  background-color: var(--color-content-hover-background);
}
</style>
