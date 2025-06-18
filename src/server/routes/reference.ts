import { Elysia } from "elysia";
import prisma from "../../lib/prisma"; // Предполагаемый клиент Prisma

export const referenceRoutes = new Elysia();

// Эндпоинт для получения списка тем справочника с поддержкой поиска
referenceRoutes.get("/api/reference-topics", async ({ query }) => {
  try {
    const searchQuery = query.q?.toString().trim().toLowerCase() || "";

    const topics = await prisma.referenceTopic.findMany({
      include: {
        files: true,
        tables: true,
      },
      orderBy: {
        order: "asc",
      },
      where: searchQuery
        ? {
            OR: [
              {
                title: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
    });

    return topics;
  } catch (error) {
    console.error("Error fetching reference topics:", error);
    return { error: "Failed to fetch reference topics" };
  }
});

// Эндпоинт для получения конкретной темы по ID
referenceRoutes.get("/api/reference-topics/:id", async ({ params }) => {
  try {
    const topic = await prisma.referenceTopic.findUnique({
      where: { id: params.id },
      include: {
        files: true,
        tables: true,
      },
    });

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic not found" }), {
        status: 404,
      });
    }

    return topic;
  } catch (error) {
    console.error("Error fetching reference topic:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch reference topic" }),
      { status: 500 }
    );
  }
});
