<script setup lang="ts">
const { options } = defineProps<{ options: readonly string[]; name: string }>()
const model = defineModel<string>({ required: true })
</script>
<template>
  <Card>
    <template #title> {{ name.toUpperCase() }} </template>
    <template #content>
      <RadioButtonGroup v-model="model" :name="name" class="flex flex-wrap gap-4">
        <div v-for="option in options" :key="option" class="flex flex-wrap items-center gap-2">
          <RadioButton :input-id="option" :value="option" name="quality" />
          <label for="cheese"> {{ option.toUpperCase() }} </label>
        </div>
      </RadioButtonGroup>
    </template>
  </Card>
</template>
