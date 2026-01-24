import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const show = ref(false)
  const text = ref('')
  const color = ref('success')

  function triggerAlert(message, type = 'success') {
    text.value = message
    color.value = type
    show.value = true
  }

  return { show, text, color, triggerAlert }
})