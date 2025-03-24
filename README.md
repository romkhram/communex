# Чат-приложение с использованием SignalR

Чат-приложение, созданное с использованием Vue.js, Ionic Framework и SignalR для обмена сообщениями в реальном времени.
Приложение позволяет пользователям отправлять и получать сообщения в реальном времени.

## Особенности

Для обхода CORSнеобходимо немного изменить файл Program.cs https://github.com/NickSuomi/AzureSignalRService прописав в нем AllowSpecificOrigin

```
var app = builder.Build();
```
на
```
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowSpecificOrigin",
    builder => builder.WithOrigins("http://localhost:5173", "http://localhost:8080")
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials());
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
```
где "http://localhost:5173" - адрес dev сборки, "http://localhost:8080" - адрес nginx для прода

Измененный файл в AzureSignalRService/Program.cs

## Установка
Для корректной сборки зависимостей, а именно https://www.npmjs.com/package/@microsoft/signalr, должна использоваться Node.js не ниже 20 версии.

### Dev
npm i
npm run dev

### Prod
./run.sh

Будет доступен по http://localhost:8080/

## Использование
Приложение будет обмениваться сообщениями, если запустить несколько вкладок браузера и зайти под разными логинами.

С условием что в Program.cs из https://github.com/NickSuomi/AzureSignalRService будут добавлены AllowSpecificOrigin сборки фронтенда
