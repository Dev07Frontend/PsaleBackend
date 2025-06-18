import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.referenceFile.deleteMany();
  await prisma.referenceTable.deleteMany();
  await prisma.referenceTopic.deleteMany();

  const topicsData = [
    {
      id: "ref_topic_1",
      order: 1,
      title: "Фонетика кабардинского языка",
      description: "Основы звукового строя кабардинского языка.",
      content: [
        {
          type: "text",
          value:
            "Кабардинский язык богат согласными звуками, включая эжективы и фарингализованные звуки.",
        },
        {
          type: "image",
          value: "/images/reference/placeholder.png",
          caption: "Фонетическая таблица",
        },
      ],
      fileId: "ref_file_1",
      fileName: "Фонетика.pdf",
      tableId: "ref_table_1",
      tableTitle: "Примеры звуков",
      tableRows: {
        Звук: "къ",
        Тип: "Эжектив",
        Пример: "къэфыгъу (солнце)",
      },
    },
    {
      id: "ref_topic_2",
      order: 2,
      title: "Глагольные формы",
      description: "Формы настоящего, прошедшего и будущего времени.",
      content: [
        {
          type: "text",
          value:
            "Глаголы изменяются по временам и лицам, например: сы сэтыж (я говорю), сы сэтыдж (я говорил).",
        },
      ],
      fileId: "ref_file_2",
      fileName: "Глаголы.pdf",
      tableId: "ref_table_2",
      tableTitle: "Формы глагола 'сэты'",
      tableRows: {
        Время: "Настоящее",
        Форма: "сы сэтыж",
        Перевод: "я говорю",
      },
    },
    {
      id: "ref_topic_3",
      order: 3,
      title: "Личные местоимения",
      description: "Использование личных местоимений в кабардинском языке.",
      content: [
        {
          type: "text",
          value: "Местоимения: сы (я), у (ты), а (он/она).",
        },
      ],
      fileId: "ref_file_3",
      fileName: "Местоимения.pdf",
      tableId: "ref_table_3",
      tableTitle: "Личные местоимения",
      tableRows: {
        Русский: "я",
        Кабардинский: "сы",
        Пример: "сы сэтыж",
      },
    },
    {
      id: "ref_topic_4",
      order: 4,
      title: "Отрицание",
      description: "Формирование отрицаний в предложениях.",
      content: [
        {
          type: "text",
          value:
            "Отрицание образуется с помощью частицы 'мы': сы мы сэтыж (я не говорю).",
        },
      ],
      fileId: "ref_file_4",
      fileName: "Отрицание.pdf",
      tableId: "ref_table_4",
      tableTitle: "Примеры отрицаний",
      tableRows: {
        Утверждение: "сы сэтыж",
        Отрицание: "сы мы сэтыж",
        Перевод: "я не говорю",
      },
    },
    {
      id: "ref_topic_5",
      order: 5,
      title: "Словообразование",
      description: "Как образуются слова с помощью суффиксов.",
      content: [
        {
          type: "text",
          value:
            "Суффиксы изменяют значение корня, напр. 'хьэ' (дом) → 'хьэлъэ' (домик).",
        },
      ],
      fileId: "ref_file_5",
      fileName: "Словообразование.pdf",
      tableId: "ref_table_5",
      tableTitle: "Примеры словообразования",
      tableRows: {
        Основа: "хьэ",
        Суффикс: "лъэ",
        "Новое слово": "хьэлъэ",
      },
    },
    {
      id: "ref_topic_6",
      order: 6,
      title: "Порядок слов",
      description: "Структура предложений в кабардинском языке.",
      content: [
        {
          type: "text",
          value: "Обычно порядок — SOV: субъект, объект, глагол.",
        },
      ],
      fileId: "ref_file_6",
      fileName: "Порядок_слов.pdf",
      tableId: "ref_table_6",
      tableTitle: "Примеры предложений",
      tableRows: {
        Русский: "Я читаю книгу",
        Кабардинский: "сы псалъэ сыджын",
        Структура: "SOV",
      },
    },
    {
      id: "ref_topic_7",
      order: 7,
      title: "Числительные",
      description: "От одного до десяти и числительные десятков.",
      content: [
        {
          type: "text",
          value: "1 — зырэ, 2 — тӀу, 3 — щы, 4 — плӀы, 10 — пщӀы.",
        },
      ],
      fileId: "ref_file_7",
      fileName: "Числительные.pdf",
      tableId: "ref_table_7",
      tableTitle: "Числа 1–10",
      tableRows: {
        Число: "5",
        Кабардинский: "тху",
        Пример: "тху кӀалэ (пять человек)",
      },
    },
    {
      id: "ref_topic_8",
      order: 8,
      title: "Формы приветствия",
      description: "Как здороваться и прощаться.",
      content: [
        {
          type: "text",
          value:
            "Приветствие — уэрэд хъущ (доброе утро), прощание — тхьэм ыIунэ (до свидания).",
        },
      ],
      fileId: "ref_file_8",
      fileName: "Приветствия.pdf",
      tableId: "ref_table_8",
      tableTitle: "Примеры",
      tableRows: {
        Ситуация: "утро",
        Приветствие: "уэрэд хъущ",
        Перевод: "доброе утро",
      },
    },
    {
      id: "ref_topic_9",
      order: 9,
      title: "Прилагательные",
      description: "Как описывать предметы и явления.",
      content: [
        {
          type: "text",
          value: "Пример: лъэпкъ (большой), кӀалэ лъэпкъ — большой человек.",
        },
      ],
      fileId: "ref_file_9",
      fileName: "Прилагательные.pdf",
      tableId: "ref_table_9",
      tableTitle: "Примеры прилагательных",
      tableRows: {
        Слово: "лъэпкъ",
        Значение: "большой",
        Пример: "кӀалэ лъэпкъ",
      },
    },
    {
      id: "ref_topic_10",
      order: 10,
      title: "Падежи",
      description: "Использование падежей в кабардинском языке.",
      content: [
        {
          type: "text",
          value:
            "Падежи выражаются постпозитивами, например: сы-кӀэ (от меня).",
        },
      ],
      fileId: "ref_file_10",
      fileName: "Падежи.pdf",
      tableId: "ref_table_10",
      tableTitle: "Примеры падежей",
      tableRows: {
        Падеж: "Исходный",
        Форма: "сы-кӀэ",
        Перевод: "от меня",
      },
    },
  ];

  for (const topic of topicsData) {
    await prisma.referenceTopic.create({
      data: {
        id: topic.id,
        order: topic.order,
        title: topic.title,
        description: topic.description,
        content: topic.content,
        createdAt: new Date("2025-06-02T18:50:00Z"),
        updatedAt: new Date("2025-06-02T18:50:00Z"),
        files: {
          create: [
            {
              id: topic.fileId,
              name: topic.fileName,
              url: `/files/reference/${topic.fileName}`,
              createdAt: new Date("2025-06-02T18:50:00Z"),
              updatedAt: new Date("2025-06-02T18:50:00Z"),
            },
          ],
        },
        tables: {
          create: [
            {
              id: topic.tableId,
              title: topic.tableTitle,
              rows: topic.tableRows,
              createdAt: new Date("2025-06-02T18:50:00Z"),
              updatedAt: new Date("2025-06-02T18:50:00Z"),
            },
          ],
        },
      },
    });
  }

  console.log("✅ Демо-данные по кабардинскому языку успешно добавлены");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при добавлении демо-данных:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
