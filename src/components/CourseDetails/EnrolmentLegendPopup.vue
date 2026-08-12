<template>
  <Button
    label="View Legend"
    size="small"
    :pt:icon:class="'text-white'"
    :pt:label:class="'text-white'"
    @click="open = true"
  />
  <Dialog
    v-model:visible="open"
    modal
    :show-header="true"
    class="p-0 md:p-4 w-screen lg:w-75vw max-w-50rem"
    :draggable="false"
    :header="`${division} Enrolment Legend`"
  >
    <div class="flex flex-col items-end">
      <div class="mt-3">
        <ul v-for="enrolmentIndicator in enrolmentIndicators" :key="enrolmentIndicator.code">
          <li :class="highlights.includes(enrolmentIndicator.code) ? 'enrolmentHighlight' : ''">
            <span class="font-medium">{{ enrolmentIndicator.code }}</span> -
            <span>{{ enrolmentIndicator.name }}</span>
          </li>
          <br />
        </ul>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EnrolmentIndicator } from '../../types/divisions.types'
import { EnrolmentInd } from '../../types/courses.types'

const open = ref(false)

const props = defineProps<{
  enrolmentIndicators: EnrolmentIndicator[]
  division: string
  highlights: EnrolmentInd[]
}>()
</script>

<style scoped>
.enrolmentHighlight {
  background-color: var(--color-divisional-highlight);
  border-radius: 4px;
}
</style>
