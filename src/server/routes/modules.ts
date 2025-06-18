import { Elysia } from "elysia";
import prisma from "../../lib/prisma";

export const moduleRoutes = new Elysia();
// Получить все модули с их уроками (короткая версия для списка)
moduleRoutes.get("/api/modules", async ({ set }) => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { order: "asc" },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });
    return modules;
  } catch (error) {
    set.status = 500;
    console.error("Error fetching modules:", error);
    return { error: "Failed to fetch modules" };
  }
});

// Прогресс пользователя по всем урокам (и краткие данные о каждом уроке)
moduleRoutes.get("/api/user-progress", async ({ query, set }) => {
  const { userId } = query;
  if (!userId || isNaN(Number(userId))) {
    set.status = 400;
    return { error: "User ID is required and must be a number" };
  }
  try {
    const lessonProgress = await prisma.userProgress.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        lesson: {
          select: { id: true, title: true, moduleId: true, order: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return { lessonProgress };
  } catch (error) {
    set.status = 500;
    console.error("Error fetching user progress:", error);
    return { error: "Failed to fetch user progress" };
  }
});

// Сохранить прогресс пользователя (создание или обновление)
interface UserProgressBody {
  userId: number;
  lessonId: number;
  moduleId: number;
  score: number;
  isCompleted: boolean;
  totalQuestions?: number;
  correctAnswers?: any[];
  incorrectAnswers?: any[];
}

moduleRoutes.post(
  "/api/user-progress",
  async ({ body, set }: { body: UserProgressBody; set: any }) => {
    const {
      userId,
      lessonId,
      moduleId,
      score,
      isCompleted,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
    } = body ?? {};

    if (
      [userId, lessonId, moduleId, score, isCompleted].some(
        (v) => v === undefined
      )
    ) {
      set.status = 400;
      return {
        error:
          "Необходимо передать userId, lessonId, moduleId, score, isCompleted",
      };
    }

    try {
      const [user, lesson, module] = await Promise.all([
        prisma.user.findUnique({ where: { id: Number(userId) } }),
        prisma.lesson.findUnique({ where: { id: Number(lessonId) } }),
        prisma.module.findUnique({ where: { id: Number(moduleId) } }),
      ]);

      if (!user || !lesson || !module) {
        set.status = 404;
        return { error: "User, lesson or module not found" };
      }

      const progress = await prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId: Number(userId),
            lessonId: Number(lessonId),
          },
        },
        update: {
          score: Number(score),
          isCompleted: Boolean(isCompleted),
          moduleId: Number(moduleId),
          updatedAt: new Date(),
        },
        create: {
          userId: Number(userId),
          lessonId: Number(lessonId),
          moduleId: Number(moduleId),
          score: Number(score),
          isCompleted: Boolean(isCompleted),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Проверяем завершён ли весь модуль
      const moduleLessons = await prisma.lesson.count({
        where: { moduleId: Number(moduleId) },
      });
      const completedLessons = await prisma.userProgress.count({
        where: {
          userId: Number(userId),
          moduleId: Number(moduleId),
          isCompleted: true,
        },
      });

      const isModuleCompleted =
        moduleLessons > 0 && moduleLessons === completedLessons;

      // Optional: Логируем аналитику
      if (
        typeof totalQuestions === "number" &&
        Array.isArray(correctAnswers) &&
        Array.isArray(incorrectAnswers)
      ) {
        console.log(
          `Analytics - Total: ${totalQuestions}, Correct: ${correctAnswers.length}, Incorrect: ${incorrectAnswers.length}`
        );
      }

      return {
        success: true,
        progress,
        isModuleCompleted,
      };
    } catch (error) {
      set.status = 500;
      console.error("Error saving user progress:", error);
      return { error: "Failed to save user progress" };
    }
  }
);
