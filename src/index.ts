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
  .use(
    cors({
      origin: "*", // Разрешаем только Next.js
      methods: ["GET", "POST", "PUT", "DELETE"], // Разрешенные методы
      allowedHeaders: ["Content-Type", "Authorization"], // Разрешенные заголовки
      credentials: true, // Разрешаем куки и авторизацию
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
