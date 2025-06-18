import { Elysia } from "elysia";
import prisma from "../../lib/prisma";

export const lessonRoutes = new Elysia();

interface QuizAnswerDto {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface QuizMatchDto {
  id: number;
  left: string;
  right: string;
}

interface QuizBlankDto {
  id: number;
  before: string;
  after: string;
  correct: string;
}

interface QuizDto {
  id: number;
  question: string;
  type: string;
  order: number;
  imageUrl?: string | null; // ✅ новое поле
  audioUrl?: string | null; // ✅ новое поле
  answers: QuizAnswerDto[];
  matches: QuizMatchDto[];
  blanks: QuizBlankDto[];
}

interface LessonDto {
  id: number;
  title: string;
  order: number;
  moduleId: number;
  theory?: { content: string } | null;
  quizzes: QuizDto[];
  createdAt: string;
  updatedAt: string;
}

lessonRoutes.get("/api/lessons/:id", async ({ params, set }) => {
  const { id } = params;
  const lessonId = Number(id);

  if (!id || isNaN(lessonId)) {
    set.status = 400;
    return { error: "ID урока обязателен и должен быть числом" };
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        theory: true,
        module: true,
        quizzes: {
          include: {
            answers: true,
            matches: true,
            blanks: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lesson) {
      set.status = 404;
      return { error: "Урок не найден" };
    }

    const lessonDto: LessonDto = {
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      moduleId: lesson.moduleId,
      theory: lesson.theory ? { content: lesson.theory.content } : null,
      quizzes: lesson.quizzes.map((q) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        order: q.order,
        imageUrl: q.imageUrl ?? null, // ✅
        audioUrl: q.audioUrl ?? null, // ✅
        answers: q.answers,
        matches: q.matches,
        blanks: q.blanks,
      })),
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
    };

    return { lesson: lessonDto };
  } catch (error) {
    set.status = 500;
    console.error("Ошибка при получении урока:", error);
    return { error: "Не удалось получить урок" };
  }
});
