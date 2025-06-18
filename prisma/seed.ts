// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Очистка справочников и связанных сущностей
  await prisma.referenceFile.deleteMany();
  await prisma.referenceTable.deleteMany();
  await prisma.referenceTopic.deleteMany();

  // 1. Алфавит кабардинского языка
  await prisma.referenceTopic.create({
    data: {
      id: "kb_topic_1",
      order: 1,
      title: "Алфавит кабардинского языка",
      description: "Буквы, транскрипция, особенности произношения.",
      content: [
        {
          type: "text",
          value:
            "Кабардинский алфавит основан на кириллице и состоит из 56 букв. Некоторые звуки уникальны для этого языка.",
        },
        {
          type: "image",
          value: "/images/reference/kb-alphabet.png",
          caption: "Алфавит кабардинского языка",
        },
      ],
      files: {
        create: [
          {
            id: "kb_file_1",
            name: "Кабардинский_алфавит.pdf",
            url: "/files/reference/kb-alphabet.pdf",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      tables: {
        create: [
          {
            id: "kb_table_1",
            title: "Примеры букв и звуков",
            rows: [
              { Буква: "А", Транскрипция: "a", Пример: "адыгэ (человек)" },
              { Буква: "Жь", Транскрипция: "ʑ", Пример: "жьэм (земля)" },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 2. Базовые фразы и приветствия
  await prisma.referenceTopic.create({
    data: {
      id: "kb_topic_2",
      order: 2,
      title: "Базовые фразы и приветствия",
      description: "Как поздороваться и попрощаться на кабардинском.",
      content: [
        {
          type: "text",
          value:
            "Вежливое приветствие: Уэф1эу! — Здравствуйте!\nПростое: Салам! — Привет!",
        },
      ],
      files: {
        create: [
          {
            id: "kb_file_2",
            name: "Фразы_приветствия.pdf",
            url: "/files/reference/kb-greetings.pdf",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      tables: {
        create: [
          {
            id: "kb_table_2",
            title: "Фразы и их перевод",
            rows: [
              { Кабардинский: "Уэф1эу!", Русский: "Здравствуйте!" },
              { Кабардинский: "Щ1эмы ф1ащэ!", Русский: "Добро пожаловать!" },
              { Кабардинский: "Щ1алэу!", Русский: "До свидания!" },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 3. Грамматика: падежи
  await prisma.referenceTopic.create({
    data: {
      id: "kb_topic_3",
      order: 3,
      title: "Грамматика: падежи",
      description: "Описание падежной системы в кабардинском языке.",
      content: [
        {
          type: "text",
          value:
            "В кабардинском языке существует 8 падежей, каждый со своими окончаниями и функциями.",
        },
      ],
      files: {
        create: [
          {
            id: "kb_file_3",
            name: "Падежи_кабардинский.pdf",
            url: "/files/reference/kb-cases.pdf",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      tables: {
        create: [
          {
            id: "kb_table_3",
            title: "Падежи и примеры",
            rows: [
              { Падеж: "Именительный", Пример: "щыт — мальчик" },
              { Падеж: "Родительный", Пример: "щытым — мальчика" },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 4. Числа
  await prisma.referenceTopic.create({
    data: {
      id: "kb_topic_4",
      order: 4,
      title: "Числа",
      description: "Числительные в кабардинском языке.",
      content: [
        {
          type: "text",
          value:
            "Изучите, как формируются и употребляются числа в кабардинском языке.",
        },
      ],
      files: {
        create: [
          {
            id: "kb_file_4",
            name: "Числа_кабардинский.pdf",
            url: "/files/reference/kb-numbers.pdf",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      tables: {
        create: [
          {
            id: "kb_table_4",
            title: "Числа от 1 до 10",
            rows: [
              { Кабардинский: "зы", Русский: "один" },
              { Кабардинский: "щы", Русский: "два" },
              { Кабардинский: "щыщ", Русский: "три" },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 5. Местоимения
  await prisma.referenceTopic.create({
    data: {
      id: "kb_topic_5",
      order: 5,
      title: "Местоимения",
      description: "Личные, притяжательные и другие местоимения.",
      content: [
        {
          type: "text",
          value:
            "Местоимения: сэ — я, у — ты, а — он/она, тхьэм — мы, шу — вы, ащэм — они.",
        },
      ],
      files: {
        create: [
          {
            id: "kb_file_5",
            name: "Местоимения_кабардинский.pdf",
            url: "/files/reference/kb-pronouns.pdf",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      tables: {
        create: [
          {
            id: "kb_table_5",
            title: "Местоимения",
            rows: [
              { Кабардинский: "сэ", Русский: "я" },
              { Кабардинский: "у", Русский: "ты" },
              { Кабардинский: "а", Русский: "он/она" },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 6. Устойчивые выражения и идиомы
  await prisma.referenceTopic.create({
    data: {
      id: "kb_topic_6",
      order: 6,
      title: "Устойчивые выражения",
      description: "Наиболее употребимые идиоматические выражения.",
      content: [
        {
          type: "text",
          value:
            "Щ1э ф1эпсэ — буквально: 'держи слово', значит: будь честен, выполняй обещание.",
        },
      ],
      files: {
        create: [
          {
            id: "kb_file_6",
            name: "Идиомы_кабардинский.pdf",
            url: "/files/reference/kb-idioms.pdf",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      tables: {
        create: [
          {
            id: "kb_table_6",
            title: "Устойчивые выражения",
            rows: [
              { Кабардинский: "Щ1э ф1эпсэ", Русский: "Держи слово" },
              { Кабардинский: "Къэбзэ къэгу", Русский: "Без проблем" },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log("Демо-данные для кабардинского языка успешно добавлены!");
}

main()
  .catch((e) => {
    console.error("Ошибка при добавлении демо-данных:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
