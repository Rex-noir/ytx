<script setup lang="ts">
import { audioQualitites, outputFormats, videoQualities } from '@ytx/shared/options'
import { Button, Card, Checkbox, InputNumber, InputText, RadioButton } from 'primevue'
import { ref } from 'vue'

const options = ref({
  selectedOutputFormat: '',
  selectedVideoQuality: '',
  selectedAudioQuality: '',
  startTime: null,
  endTime: null,
  attachThumbnail: false,
})
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-3 p-2">
    <InputText placeholder="Youtube link" />

    <div class="grid gap-5 md:grid-cols-2">
      <Card>
        <template #title>Ouput Format</template>
        <template #subtitle> YTX will convert the file to selected output format.</template>
        <template #content>
          <div v-for="format in outputFormats" :key="format" class="flex items-center gap-2">
            <RadioButton
              v-model="options.selectedOutputFormat"
              :value="format"
              :inputId="format"
              :name="format"
            />
            <label :for="format"> {{ format }} </label>
          </div>
        </template>
      </Card>
      <Card>
        <template #title>Video quality</template>
        <template #subtitle
          >Ignore this if the output is in audio format. If the selected ouput is not
        </template>
        <template #content>
          <div v-for="vQuality in videoQualities" :key="vQuality" class="flex items-center gap-2">
            <RadioButton
              :input-id="vQuality"
              v-model="options.selectedVideoQuality"
              :name="vQuality"
              :value="vQuality"
            />
            <label :for="vQuality"> {{ vQuality }} </label>
          </div>
        </template>
      </Card>
      <Card>
        <template #title>Audio quality</template>
        <!-- <template #subtitle
          >Ignore this if the output is in format. If the selected ouput is not
        </template> -->
        <template #content>
          <div v-for="aQuality in audioQualitites" :key="aQuality" class="flex items-center gap-2">
            <RadioButton
              :input-id="aQuality"
              :name="aQuality"
              :value="aQuality"
              v-model="options.selectedAudioQuality"
            />
            <label :for="aQuality"> {{ aQuality }} </label>
          </div>
        </template>
      </Card>
      <Card>
        <template #title>Trimming</template>
        <template #subtitle>Start and end time of the video in seconds. </template>
        <template #content>
          <InputNumber v-model="options.startTime" fluid placeholder="Start time" />
          <InputNumber v-model="options.endTime" fluid placeholder="End Time" />
        </template>
      </Card>
      <Card class="md:col-span-2">
        <template #title>Additional Options</template>
        <!-- <template #subtitle
          >Ignore this if the output is in format. If the selected ouput is not
        </template> -->
        <template #content>
          <div class="flex items-center gap-2">
            <Checkbox
              binary
              v-model="options.attachThumbnail"
              inputId="attachThumbnail"
              name="attachThumbnail"
              value="attachThumbnail"
            />
            <label for="attachThumbnail"> Attach Thumbnail </label>
          </div>
        </template>
      </Card>
    </div>

    <Button type="button" label="Download" :loading="true" />
  </main>
</template>
