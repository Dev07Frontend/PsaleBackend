// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  // 1. Модуль 1
  const module1 = await prisma.module.create({
    data: {
      title: "Базовый курс",
      description: "Начальный модуль для изучения кабардинского языка",
      image: "/images/modules/kabardian-basics.jpg",
      order: 1,
    },
  });

  // 2. Урок 1
  const lesson1 = await prisma.lesson.create({
    data: {
      title: "Урок 1: Приветствие",
      order: 1,
      moduleId: module1.id,
    },
  });

  await prisma.theory.create({
    data: {
      lessonId: lesson1.id,
      content:
        "<h2>Приветствие</h2><p>В кабардинском языке приветствие звучит как «ФIащIэ».</p>",
    },
  });

  // 3 примера квизов (разных типов)
  // 1. Multiple Choice
  await prisma.quiz.create({
    data: {
      lessonId: lesson1.id,
      type: "MULTIPLE_CHOICE",
      question: "Как переводится «ФIащIэ»?",
      order: 1,
      answers: {
        create: [
          { text: "Здравствуйте", isCorrect: true },
          { text: "До свидания", isCorrect: false },
          { text: "Спасибо", isCorrect: false },
          { text: "Пожалуйста", isCorrect: false },
        ],
      },
    },
  });

  // 2. Image Quiz
  await prisma.quiz.create({
    data: {
      lessonId: lesson1.id,
      type: "MULTIPLE_CHOICE",
      question: "Что изображено на картинке?",
      order: 2,
      imageUrl: "/uploads/hello.png",
      answers: {
        create: [
          { text: "Приветствие", isCorrect: true },
          { text: "Дом", isCorrect: false },
          { text: "Машина", isCorrect: false },
          { text: "Река", isCorrect: false },
        ],
      },
    },
  });

  // 3. Fill in the blank
  await prisma.quiz.create({
    data: {
      lessonId: lesson1.id,
      type: "FILL_IN_THE_BLANK",
      question: "Дополните фразу",
      order: 3,
      blanks: {
        create: {
          before: "Фраза для приветствия:",
          after: "",
          correct: "ФIащIэ",
        },
      },
      answers: {
        create: [
          { text: "ФIащIэ", isCorrect: true },
          { text: "ЩIалэу", isCorrect: false },
          { text: "Щхьэ", isCorrect: false },
          { text: "Нэхъ", isCorrect: false },
        ],
      },
    },
  });

  // Пример второго модуля и урока (очень кратко)
  const module2 = await prisma.module.create({
    data: {
      title: "Модуль 2",
      description: "Второй модуль",
      image: "/images/modules/module2.jpg",
      order: 2,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: "Урок 2: Основы",
      order: 1,
      moduleId: module2.id,
    },
  });

  await prisma.theory.create({
    data: {
      lessonId: lesson2.id,
      content: "<h2>Основы</h2><p>Теория урока 2.</p>",
    },
  });

  // Минимум один квиз для второго урока
  await prisma.quiz.create({
    data: {
      lessonId: lesson2.id,
      type: "MULTIPLE_CHOICE",
      question: "Вопрос по основам?",
      order: 1,
      answers: {
        create: [
          { text: "Ответ", isCorrect: true },
          { text: "Нет", isCorrect: false },
        ],
      },
    },
  });

  console.log("✅ Примеры модулей, уроков и квизов созданы!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
