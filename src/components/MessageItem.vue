<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonAvatar, IonItem, IonLabel } from '@ionic/vue'
import { Message } from '@/types/index.ts'

interface MyComponentProps {
  message: Message
  currentLogin: string
}

const props = defineProps<MyComponentProps>()
/**
 * Этот компонент сделан чтобы вычисляемы свойства были не через функции, а через computed
 */

/**
 * Преобразует сообщение в многосторчный вид
 */
const messageText = computed(() => {
  return props.message?.message?.replace(/\n/g, '<br>')
})
/**
 * Вычисляет где находится аватар, если это моё сообщение - справа
 */
const isItMe = computed(() => {
  return props?.message?.user === props.currentLogin
})
</script>
<template>
  <ion-item class="ion-align-items-start">
    <ion-avatar aria-hidden="true" :slot="isItMe ? 'end' : 'start'">
      <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
    </ion-avatar>
    <ion-label>
      <h2>{{ message.user }}</h2>
      <p v-html="messageText"></p>
    </ion-label>
  </ion-item>
</template>
<style lang="scss" scoped></style>
