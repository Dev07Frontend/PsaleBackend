import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import authRoutes from "./server/routes/auth";
import userRoutes from "./server/routes/user";
import { cors } from "@elysiajs/cors";
import { referenceRoutes } from "./server/routes/reference";
import { moduleRoutes } from "./server/routes/modules";
import { lessonRoutes } from "./server/routes/lessons";
import { staticPlugin } from "@elysiajs/static";
import { join } from "path";

const app = new Elysia()
  // Логирование всех запросов
  .onRequest(({ request }) => {
    console.log(`[${request.method}] ${request.url}`);
  })

  // Настройки CORS для Coolify
  .use(
    cors({
      origin: /.*\.sslip\.io$/, // Разрешаем все поддомены sslip.io
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      exposedHeaders: ["Content-Disposition"] // Для файловых загрузок
    })
  )
  // Подключаем маршруты авторизации
  .use(authRoutes)
  .use(userRoutes)
  // Подключение маршрутов справочника
  .use(referenceRoutes)
  .use(moduleRoutes)
  .use(lessonRoutes)
  .use(
    swagger({
      path: "/docs", // Путь, по которому будет доступна документация
      exclude: ["/secret"], // Исключить определенные пути из документации
      documentation: {
        info: {
          title: "Psale API Documentation",
          description: "Документация API для приложения Psale",
          version: "1.0.0",
          contact: {
            name: "Developer",
            email: "dev@example.com",
          },
          license: {
            name: "MIT",
            url: "https://opensource.org/licenses/MIT",
          },
        },
        tags: [
          {
            name: "Main",
            description: "Main endpoints",
          },
        ],
      },
    })
  )
  .use(
    staticPlugin({
      assets: join(__dirname, "uploads"), // Путь относительно корня проекта Elysia
      prefix: "/uploads",
    })
  )
  // Пример маршрута для проверки работоспособности
  .get("/", () => "Сервер запущен!")
  .listen(3050);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
