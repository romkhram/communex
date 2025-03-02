# Используем официальный образ Nginx
FROM nginx:latest

# Удаляем стандартную конфигурацию Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем свою конфигурацию
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранный фронт в корневую папку Nginx
COPY dist /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
