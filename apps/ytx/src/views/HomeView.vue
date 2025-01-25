<script setup lang="ts">
import { getEnv } from '@/utils'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { audioQualitites, outputFormats, videoQualities } from '@ytx/shared/options'
import { GenerateRequestSchema } from '@ytx/shared/schemas'
import {
  Button,
  Card,
  Checkbox,
  InputNumber,
  InputText,
  Message,
  RadioButton,
  useToast,
} from 'primevue'
import { ref } from 'vue'

const options = ref({
  selectedOutputFormat: '',
  selectedVideoQuality: '',
  selectedAudioQuality: '',
  startTime: null,
  endTime: null,
  attachThumbnail: false,
})

const toast = useToast()

const resovlers = ref(zodResolver(GenerateRequestSchema))

const apiURl = getEnv('VITE_API_URL')

const handleSubmit = async (e: FormSubmitEvent) => {
  if (!e.valid) {
    toast.add({
      severity: 'error',
      summary: 'Please fill all the fields',
    })
    return
  }

  const response = await fetch(`${apiURl}/generate-download-link`, {
    method: 'POST',
    body: JSON.stringify(e.values),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  console.log(await response.json())
}
</script>

<template>
  <main class="">
    <Form
      v-slot="$form"
      class="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-3 p-2"
      :resolver="resovlers"
      @submit="handleSubmit"
      validate-on-mount
      validate-on-blur
    >
      <div class="flex flex-col gap-2">
        <InputText name="youtubeUrl" fluid placeholder="Youtube link" />
        <div class="min-h-[2rem]">
          <Message
            size="small"
            severity="error"
            v-if="
              $form.youtubeUrl?.invalid &&
              $form.youtubeUrl.dirty &&
              $form.youtubeUrl.value.length > 0
            "
          >
            {{ $form.youtubeUrl?.error.message }}
          </Message>
          <Message size="small" severity="info" v-else>
            Support for youtube and youtube music.
          </Message>
        </div>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
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
                name="videoQuality"
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
            <div
              v-for="aQuality in audioQualitites"
              :key="aQuality"
              class="flex items-center gap-2"
            >
              <RadioButton
                :input-id="aQuality"
                name="audioQuality"
                :value="aQuality"
                v-model="options.selectedAudioQuality"
              />
              <label :for="aQuality"> {{ aQuality }} </label>
            </div>
          </template>
        </Card>
        <Card>
          <template #title>Ouput Format</template>
          <template #subtitle> YTX will convert the file to selected output format.</template>
          <template #content>
            <div v-for="format in outputFormats" :key="format" class="flex items-center gap-2">
              <RadioButton
                v-model="options.selectedOutputFormat"
                :value="format"
                :inputId="format"
                name="format"
              />
              <label :for="format"> {{ format }} </label>
            </div>
          </template>
        </Card>
        <Card>
          <template #title>Trimming</template>
          <template #subtitle>Start and end time of the video in seconds. </template>
          <template #content>
            <InputNumber
              v-model="options.startTime"
              name="startTime"
              fluid
              placeholder="Start time"
            />
            <InputNumber v-model="options.endTime" name="endTime" fluid placeholder="End Time" />
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
                name="saveThumbnail"
              />
              <label for="attachThumbnail"> Attach Thumbnail </label>
            </div>
          </template>
        </Card>
      </div>

      <Button type="submit" :disabled="!$form.valid" label="Download" />
    </Form>
  </main>
</template>
