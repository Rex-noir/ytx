<script setup lang="ts">
import LogSection from '@/components/LogSection.vue'
import { getEnv } from '@/utils'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useForm } from '@primevue/forms/useform'
import {
  audioFormats,
  audioQualityMap,
  filtersMap,
  optionInfoMap,
  videoFormats,
  videoQualitiesMap,
} from '@ytx/shared/options'
import { GenerateRequestSchema } from '@ytx/shared/schemas'
import { useToast } from 'primevue'
import { ref } from 'vue'

const toast = useToast()

const apiURL = getEnv('VITE_API_URL', 'http://localhost:3000/api')

const progress = ref<string | null>(null)

const log = ref<string[]>([])

const formats = ref<readonly string[]>([...videoFormats])
const qualities = ref<Record<string, string>>(videoQualitiesMap)

const form = useForm({ resolver: zodResolver(GenerateRequestSchema), validateOnMount: true })

form.defineField('url', { initialValue: '' })
form.defineField('filter', { initialValue: 'mergevideo' })
form.defineField('format', { initialValue: 'mkv' })
form.defineField('quality', { initialValue: 'bv*+ba/b' })
form.defineField('embedThumbnail', { initialValue: true })
form.defineField('addMetaData', { initialValue: true })
form.defineField('embedSubs', { initialValue: true })
form.defineField('audioQuality', { initialValue: 'bestaudio' })

const handleFilterChange = (filter: string) => {
  if (filter === 'audioonly') {
    formats.value = audioFormats
    qualities.value = audioQualityMap
    form.states.quality.value = 'bestaudio'
    form.states.format.value = 'm4a'
  }
  if (filter === 'videoonly' || filter === 'mergevideo') {
    formats.value = videoFormats
    qualities.value = videoQualitiesMap
    form.states.quality.value = 'bv*+ba/b'
    form.states.format.value = 'mkv'
  }
}

const onSubmit = async (e: FormSubmitEvent) => {
  if (e.valid) {
    const response = await fetch(`${apiURL}/generate-download-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: form.states.url.value,
        filter: form.states.filter.value,
        format: form.states.format.value,
        quality: form.states.quality.value,
        embedThumbnail: form.states.embedThumbnail.value,
        addMetaData: form.states.addMetaData.value,
        embedSubs: form.states.embedSubs.value,
      }),
    })

    log.value.push('Request sent to the server, waiting for response...')
    progress.value = 'Starting'

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const result = await reader?.read()

      if (result?.done) break

      const chunk = decoder.decode(result?.value)
      try {
        const data = JSON.parse(chunk)

        if (data['_percent_str']) {
          progress.value = data['_percent_str']
        }

        if (data.status === 'error') {
          toast.add({ severity: 'error', summary: 'Error', detail: data.message })
          log.value.push(data.message)
          break
        }

        if (data.status === 'complete') {
          progress.value = null
          toast.add({ severity: 'success', summary: 'Success', detail: 'Download link generated' })
          log.value.push('Process completed, Initiating download ....')

          const downloadLink = await fetch(`${apiURL}/file/${encodeURIComponent(data['file'])}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          })

          const blob = await downloadLink.blob()

          // Create a temporary <a> element to trigger the download
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data['file'].split('/').pop() || 'download' // Use the file name from the path
          document.body.appendChild(a)
          a.click()

          // Clean up
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)

          break
        }
        log.value.push(
          `Status : Processing. Processed Bytes : ${data['downloaded_bytes']}. Total Bytes : ${data['total_bytes']}. Speed : ${data['_speed_str']}. ETA : ${data['eta_str']}. Elapsed : ${data['_elapsed_str']}`,
        )
      } catch {}
    }
  } else {
    const error = Object.values(e.errors)[0][0]['message']
    toast.add({ severity: 'error', summary: 'Error', detail: error })
  }
}
</script>

<template>
  <main class="mx-auto gap-10 p-5 md:grid md:max-w-[80%] md:grid-cols-2">
    <Card>
      <template #content>
        <Form
          @submit="form.handleSubmit((e: FormSubmitEvent) => onSubmit(e))()"
          class="flex flex-col gap-10"
        >
          <InputText placeholder="Enter url" v-model="form.states.url.value" label="URL" />
          <Message>
            Filter : {{ filtersMap[form.states.filter.value as keyof typeof filtersMap] }}
            <p>{{ optionInfoMap[form.states.filter.value as keyof typeof optionInfoMap] }}</p>
          </Message>
          <Card>
            <template #title>Filter</template>
            <template #content>
              <RadioButtonGroup
                @value-change="handleFilterChange"
                class="flex flex-wrap gap-5"
                v-model="form.states.filter.value"
              >
                <div
                  v-for="(filter, key) in filtersMap"
                  :key="filter"
                  class="flex items-center gap-2"
                >
                  <RadioButton :input-id="filter" :value="key" />
                  <label for="cheese"> {{ filter }} </label>
                </div>
              </RadioButtonGroup>
            </template>
          </Card>

          <Card>
            <template #title>Format</template>
            <template #content>
              <RadioButtonGroup class="flex flex-wrap gap-5" v-model="form.states.format.value">
                <div v-for="filter in formats" :key="filter" class="flex items-center gap-2">
                  <RadioButton :input-id="filter" :value="filter" />
                  <label for="cheese"> {{ filter }} </label>
                </div>
              </RadioButtonGroup>
            </template>
          </Card>
          <Card>
            <template #title>
              {{
                form.states.filter.value === 'audioandvideo' ? 'Video Quality' : 'Quality'
              }}</template
            >
            <template #content>
              <RadioButtonGroup class="flex flex-wrap gap-5" v-model="form.states.quality.value">
                <div
                  v-for="(quality, key) in qualities"
                  :key="quality"
                  class="flex items-center gap-2"
                >
                  <RadioButton :input-id="quality" :value="key" />
                  <label :for="quality"> {{ quality }} </label>
                </div>
              </RadioButtonGroup>
            </template>
          </Card>

          <Card v-if="form.states.filter.value === 'audioandvideo'">
            <template #title> Audio Quality</template>
            <template #content>
              <RadioButtonGroup
                class="flex flex-wrap gap-5"
                v-model="form.states.audioQuality.value"
              >
                <div
                  v-for="(quality, key) in audioQualityMap"
                  :key="quality"
                  class="flex items-center gap-2"
                >
                  <RadioButton :input-id="quality" :value="key" />
                  <label :for="quality"> {{ quality }} </label>
                </div>
              </RadioButtonGroup>
            </template>
          </Card>

          <Card>
            <template #title>Options</template>
            <template #content>
              <div class="flex flex-wrap gap-4">
                <div
                  v-if="form.states.filter.value !== 'audioonly'"
                  class="flex items-center gap-2"
                >
                  <Checkbox
                    v-model="form.states.embedSubs.value"
                    input-id="embedSubs"
                    :value="true"
                    name="embedSubs"
                    binary
                  />
                  <label for="embedSubs"> Embed Subs </label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="form.states.addMetaData.value"
                    input-id="addMetaData"
                    :value="true"
                    name="addMetaData"
                    binary
                  />
                  <label for="addMetaData"> Add Metadata </label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="form.states.embedThumbnail.value"
                    input-id="embedThumbnail"
                    :value="true"
                    name="embedThumbnail"
                    binary
                  />
                  <label for="embedThumbnail"> Embed Thumbnail </label>
                </div>
              </div>
            </template>
          </Card>

          <Button type="submit" label="Start the process." fluid />
        </Form> </template
    ></Card>
    <LogSection :progress="progress" :logs="log" />
  </main>
</template>
