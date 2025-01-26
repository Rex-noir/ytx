<script setup lang="ts">
import SelectOptions from '@/components/SelectOptions.vue'
import { audioAndVideo, audioOnly, mergeVideo, videoOnly } from '@ytx/shared/options'
import { GenerateRequestSchema } from '@ytx/shared/schemas'
import { useToast } from 'primevue'
import { ref } from 'vue'
import { ZodError } from 'zod'

const errors = ref('')
const toast = useToast()

const tabs: Record<string, string> = {
  '0': 'videoonly',
  '1': 'audioonly',
  '2': 'audioandvideo',
  '3': 'mergevideo',
}
const models = ref({
  quality: '',
  format: '',
  filter: tabs['0'],
  url: '',
})

const onSubmit = () => {
  try {
    GenerateRequestSchema.parse(models.value)
  } catch (error) {
    // Explicitly narrow the type of `error` to `ZodError`
    if (error instanceof ZodError) {
      toast.add({
        severity: 'error',
        summary: 'Please make sure you input valid data.',
        detail: error.errors[0].message, // Now `error` is correctly typed as `ZodError`
      })
      return
    }

    toast.add({
      severity: 'error',
      summary: 'Something went wrong.',
      detail: 'Please try again later.',
    })
  }
}
const handleTabChange = (value: string | number) => {
  models.value.filter = tabs[value]
  models.value.format = ''
  models.value.quality = ''
}

const tabPanels = [
  {
    value: '0',
    label: 'Video Only',
    options: [
      { name: 'quality', options: videoOnly.qualities },
      { name: 'format', options: videoOnly.format },
    ],
  },
  {
    value: '1',
    label: 'Audio Only',
    options: [{ name: 'quality', options: audioOnly.qualities }],
  },
  {
    value: '2',
    label: 'Audio And Video',
    options: [
      { name: 'quality', options: audioAndVideo.qualities },
      { name: 'format', options: audioAndVideo.format },
    ],
  },
  {
    value: '3',
    label: 'Merge Video',
    options: [
      { name: 'quality', options: mergeVideo.qualities },
      { name: 'format', options: mergeVideo.format },
    ],
  },
]
</script>

<template>
  <main>
    <div class="mx-auto mt-4 flex max-w-3xl flex-col justify-center gap-2 p-5">
      <Message size="small" :severity="errors ? 'error' : 'info'">
        {{ errors ? errors : 'YTX Youtube Downloader' }}
      </Message>

      <InputText placeholder="Enter YT url" v-model="models.url" name="url" fluid />

      <Tabs @update:value="handleTabChange" scrollable class="w-full" value="0">
        <TabList
          :pt="{
            tabList: { class: 'flex justify-between items-center' },
          }"
        >
          <Tab v-for="tab in tabPanels" :key="tab.value" :value="tab.value">{{ tab.label }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel
            class="flex flex-col gap-5"
            v-for="tab in tabPanels"
            :key="tab.value"
            :value="tab.value"
          >
            <SelectOptions
              v-for="option in tab.options"
              :key="option.name"
              v-model="models[option.name as keyof typeof models]"
              :name="option.name"
              :options="option.options"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Button @click="onSubmit" type="button">Download</Button>
    </div>
  </main>
</template>
