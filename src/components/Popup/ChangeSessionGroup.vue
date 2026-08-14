<template>
  <div>
    <Dialog
      v-model:visible="visibleRef"
      modal
      :style="{ 'max-width': '290px' }"
      :show-header="false"
      aria-label="Change session group warning"
    >
      <h2 class="text-lg font-bold my-2">Warning</h2>
      <p>
        Changing session groups will delete your current timetable and selected courses. Do you want
        to continue?
      </p>
      <div class="flex justify-between mt-6">
        <Button label="Cancel" @click="handleCancel" />
        <Button label="Continue" @click="handleContinue" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const visibleRef = ref(props.visible)

const dialogVisible = ref(false)

const emit = defineEmits(['update:visible', 'cancel', 'continue'])

watch(
  () => props.visible,
  (val: boolean) => {
    dialogVisible.value = val
  },
)

watch(dialogVisible, (val: boolean) => {
  emit('update:visible', val)
})

const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}

const handleContinue = () => {
  dialogVisible.value = false
  emit('continue')
}
</script>
