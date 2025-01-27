<script setup lang="ts">
interface Props {
  progress: string | null
  logs: string[]
}

defineProps<Props>()
const getProgressValue = (progressStr: string | null): number => {
  if (!progressStr) return 0
  const match = progressStr.match(/(\d+(\.\d+)?)%/)
  return match ? parseFloat(match[1]) : 0
}

const getLogStatus = (log: string): 'success' | 'info' | 'warning' => {
  const lowercaseLog = log.toLowerCase()
  if (lowercaseLog.includes('complete') || lowercaseLog.includes('success')) return 'success'
  if (lowercaseLog.includes('error') || lowercaseLog.includes('failed')) return 'warning'
  return 'info'
}

const getStatusConfig = (status: 'success' | 'info' | 'warning') => {
  const configs = {
    success: {
      icon: 'pi-check-circle',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-500',
    },
    info: {
      icon: 'pi-info-circle',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-500',
    },
    warning: {
      icon: 'pi-exclamation-circle',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-500',
    },
  }
  return configs[status]
}

const formatTimestamp = () => {
  return new Date().toLocaleTimeString()
}
</script>

<template>
  <Card class="h-full">
    <template #title>
      <div class="flex items-center gap-3">
        <i class="pi pi-terminal text-xl"></i>
        <span class="text-xl font-semibold">Process Log</span>
      </div>
    </template>
    <template #subtitle>
      <div class="flex items-center gap-2">
        <i class="pi pi-clock text-sm"></i>
        <span>Real-time progress and logs</span>
      </div>
    </template>

    <template #content>
      <div class="flex w-full flex-col gap-4">
        <!-- Progress Section -->
        <div v-if="progress" class="w-full rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div class="mb-2 flex w-full items-center justify-between">
            <span class="text-sm font-medium">Processing</span>
            <span class="text-sm font-semibold">{{ progress }}</span>
          </div>
          <ProgressBar :value="getProgressValue(progress)" :showValue="false" class="h-2 w-full" />
        </div>

        <!-- Logs Section -->
        <ScrollPanel class="h-[800px]">
          <div class="flex w-full flex-col gap-3">
            <div
              v-for="(logItem, index) in logs"
              :key="index"
              class="w-full rounded-lg border-l-4 bg-white p-3 shadow-sm transition-all hover:shadow-md"
              :class="getStatusConfig(getLogStatus(logItem)).borderColor"
            >
              <div class="flex w-full items-start justify-between gap-4">
                <div class="flex items-center gap-2">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full"
                    :class="[
                      getStatusConfig(getLogStatus(logItem)).bgColor,
                      getStatusConfig(getLogStatus(logItem)).textColor,
                    ]"
                  >
                    <i class="pi text-sm" :class="getStatusConfig(getLogStatus(logItem)).icon"></i>
                  </div>
                  <span class="text-sm">{{ logItem }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ formatTimestamp() }}</span>
              </div>
            </div>
          </div>
        </ScrollPanel>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.p-scrollpanel .p-scrollpanel-wrapper {
  border-right: none;
}

.p-scrollpanel .p-scrollpanel-bar {
  background: #e2e8f0;
  border-radius: 0;
  opacity: 1;
}
</style>
