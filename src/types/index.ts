/**
 * Интерфейс для описания структуры сообщения.
 * @typedef {Object} Message
 * @property {string} user - Имя пользователя, отправившего сообщение.
 * @property {string} [message] - Текст сообщения в полученных.
 * @property {string} [timestamp] - Время отправки сообщения.
 * @property {string} [text] - Текст сообщения, при отправке, аналогичен `message`.
 */
export interface Message {
  user: string
  message?: string
  timestamp?: string
  text?: string
}
