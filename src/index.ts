import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import authRoutes from "./server/routes/auth";
import userRoutes from "./server/routes/user";
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

  // Настройки CORS для разрешения всех источников
  .use(
    cors({
      origin: true, // Разрешить все источники
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Разрешенные методы
      allowedHeaders: ["Content-Type", "Authorization"], // Разрешенные заголовки
      credentials: true, // Поддержка кук
      preflight: true, // Обработка предварительных запросов
    })
  )
  // Подключаем маршруты
  .use(authRoutes)
  .use(userRoutes)
  .use(referenceRoutes)
  .use(moduleRoutes)
  .use(lessonRoutes)
  .use(
    swagger({
      path: "/docs",
      exclude: ["/secret"],
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
      assets: join(__dirname, "uploads"),
      prefix: "/uploads",
    })
  )
  // Проверка работоспособности
  .get("/", () => "Сервер запущен!")
  .listen(3050);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
