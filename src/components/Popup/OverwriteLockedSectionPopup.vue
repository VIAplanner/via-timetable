<template>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      :style="{ 'max-width': '290px' }"
      :show-header="false"
      aria-label="Overwrite locked section warning"
    >
      <h2 class="text-lg font-bold my-2">Warning</h2>
      <p>
        You are trying to overwrite a section that is currently locked, do you want to unlock it and
        proceed?
      </p>
      <div class="flex justify-between mt-6">
        <Button label="Cancel" @click="visible = false" />
        <Button label="Proceed" @click="visible = false" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'

const visible: Ref<boolean> = ref(true)
</script>
