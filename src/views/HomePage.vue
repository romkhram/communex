<script setup lang="ts">
// Components
import MessageItem from '@/components/MessageItem.vue'

import { ref, reactive, computed } from 'vue'
import * as signalR from '@microsoft/signalr'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonTextarea,
  IonButton,
  IonIcon,
  IonInput,
} from '@ionic/vue'
import { send } from 'ionicons/icons'
import { Message } from '@/types/index.ts'

const endPoint = 'http://localhost:3209'
// Поле логина при авторизации
const authLogin = ref<string | null>(null)
// Активный текущий логин, от его наличия зависит отображается чат или страница логина
const currentLogin = ref<string | null>(null)
// Сообщение до отправки
const currentMessage = ref<string | null>(null)
// Принятые сообщения
const messagesArray = reactive<Message[]>([])

/**
 * Устанавливает логин для текущего пользователя.
 * Если логин пустой, ничего не происходит.
 */
const setLogin = () => {
  if (!authLogin?.value?.length) return
  currentLogin.value = authLogin.value
}

/**
 * Подключение к SignalR серверу.
 * Обрабатывает получение новых сообщений.
 */
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${endPoint}/messenger/hub`)
  // Автоматическое переподключение
  .withAutomaticReconnect()
  .build()

/**
 * Обрабатывает получение сообщений от SignalR.
 * @param {string} user - Имя пользователя, отправившего сообщение.
 * @param {string} message - Текст сообщения.
 * @param {string} timestamp - Время отправки сообщения.
 */
connection.on('ReceiveMessage', (user, message, timestamp) => {
  messagesArray.push({
    user,
    message,
    timestamp,
  })
})

/**
 * Инициирует подключение к SignalR и пытается переподключиться через 5 секунд в случае ошибки.
 */
const startSignalR = async () => {
  try {
    await connection.start()
  } catch (err) {
    setTimeout(startSignalR, 5000)
  }
}
/**
 * Запускает функцию инициации подключение к SignalR.
 */
startSignalR()

/**
 * Универсальная функция POST-запроса.
 * @param {string} path - Путь к API, куда будет отправлено сообщение.
 * @param {Message} body - Тело запроса, содержащее сообщение.
 * @returns {Promise<any>} Ответ от сервера в формате JSON.
 */
const setAnyItems = async (path: string, body: Message) => {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    return await response.json()
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Отправление сообщения через API, если логин и сообщение не пусты.
 */
const sendMessage = async () => {
  if (!currentLogin?.value?.length || !currentMessage.value?.length) return

  const res: Message = await setAnyItems(`${endPoint}/api/messenger/send`, {
    user: currentLogin.value,
    text: currentMessage.value,
  })

  if (res?.timestamp) {
    currentMessage.value = null
  }
}

/**
 * Обрабатывает нажатие клавиш, отправляя сообщение, если не нажата клавиша Shift.
 * @param {KeyboardEvent} e - Событие нажатия клавиши.
 */
const newLineOrSend = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    sendMessage()
  }
}
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Communex Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="content-wrapper">
        <ion-card class="chat-wrapper" v-if="currentLogin">
          <ion-card-header color="primary">
            <ion-card-title>{{ currentLogin }}</ion-card-title>
          </ion-card-header>
          <ion-card-content class="chat-content">
            <ion-list>
              <!--              -->
              <message-item
                v-for="message in messagesArray"
                :key="message.timestamp"
                :message="message"
                :current-login="currentLogin"
              />

              <!--               -->
            </ion-list>
          </ion-card-content>

          <ion-card-content class="chat-action">
            <ion-textarea
              label="Enter text"
              label-placement="stacked"
              fill="outline"
              auto-grow
              v-model="currentMessage"
              @keydown.enter="newLineOrSend"
            >
            </ion-textarea>
            <ion-button shape="round" @click="sendMessage">
              <ion-icon slot="icon-only" :icon="send"></ion-icon>
            </ion-button>
          </ion-card-content>
        </ion-card>

        <ion-card class="login-wrapper" v-else>
          <ion-card-content class="login-action">
            <ion-input
              label="Login"
              fill="outline"
              label-placement="stacked"
              v-model="authLogin"
              @keyup.enter="setLogin"
            >
            </ion-input>
            <ion-button @click="setLogin">Log&nbsp;In</ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-content {
  flex: 1 1 auto;
  overflow-y: auto;
}
.chat-wrapper {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 90%;
}
@media (max-width: 575px) {
  .chat-wrapper {
    width: 100%;
  }
}
.chat-action,
.login-action {
  display: flex;
  gap: 1em;
}
.chat-action {
  align-items: end;
}
.login-action {
  align-items: center;
}
</style>
