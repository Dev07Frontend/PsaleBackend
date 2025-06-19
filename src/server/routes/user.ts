// server/routes/user.ts
import { Elysia, t } from "elysia";
import prisma from "../../lib/prisma";
import { getTokenFromHeader } from "../../lib/auth";
import { jwtVerify } from "jose";
import { writeFile } from "fs/promises";
import fs from "fs";
import { join } from "path";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const UPLOAD_DIR = join(__dirname, "../../uploads");

const userRoutes = new Elysia({ prefix: "/user" })
  .get(
    "/me",
    async ({ headers }) => {
      const token = getTokenFromHeader(headers);
      if (!token) {
        throw new Error("Unauthorized");
      }

      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const { userId } = payload as { userId: number; role: string };

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarURL: true,
          email: true,
          bgCover: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        user: {
          ...user,
          avatarURL: user.avatarURL ?? undefined,
          bgCover: user.bgCover ?? undefined,
        },
      };
    },
    {
      response: {
        200: t.Object({
          user: t.Object({
            id: t.Number(),
            firstName: t.String(),
            lastName: t.String(),
            avatarURL: t.Optional(t.String()),
            email: t.String(),
            bgCover: t.Optional(t.String()),
          }),
        }),
        401: t.Object({
          error: t.String(),
        }),
        404: t.Object({
          error: t.String(),
        }),
      },
    }
  )
  .put(
    "/me",
    async ({ headers, body }) => {
      const token = getTokenFromHeader(headers);
      if (!token) {
        throw new Error("Unauthorized");
      }

      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const { userId } = payload as { userId: number; role: string };

      const { firstName, lastName, avatarURL, bgCover, email } = body;
      console.log("Final update data:", body);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          email: email || undefined,
          avatarURL: avatarURL || undefined,
          bgCover: bgCover || undefined,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarURL: true,
          email: true,
          bgCover: true,
        },
      });

      return {
        user: {
          ...updatedUser,
          avatarURL: updatedUser.avatarURL ?? undefined,
          bgCover: updatedUser.bgCover ?? undefined,
        },
      };
    },
    {
      body: t.Object({
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        email: t.Optional(t.String()),
        avatarURL: t.Optional(t.String()),
        bgCover: t.Optional(t.String()),
      }),
      response: {
        200: t.Object({
          user: t.Object({
            id: t.Number(),
            firstName: t.String(),
            lastName: t.String(),
            avatarURL: t.Optional(t.String()),
            email: t.String(),
            bgCover: t.Optional(t.String()),
          }),
        }),
        401: t.Object({
          error: t.String(),
        }),
      },
    }
  )
  .post(
    "/upload-cover",
    async ({ headers, request }) => {
      const token = getTokenFromHeader(headers);
      if (!token) throw new Error("Unauthorized");

      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const { userId } = payload as { userId: number; role: string };

      const formData = await request.formData();
      const file = formData.get("cover") as File | null;
      if (!file) throw new Error("File not uploaded");

      await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });

      const sanitizedFileName = `${Date.now()}-${file.name.replace(
        /\s+/g,
        "-"
      )}`;
      const filePath = join(UPLOAD_DIR, sanitizedFileName);

      try {
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
      } catch (error) {
        console.error("Error saving file:", error);
        throw new Error("Failed to save file");
      }

      const url = `http://gw48so0ko4g8go00soo0gswc.109.172.101.92.sslip.io/uploads/${sanitizedFileName}`;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { bgCover: url },
        select: {
          id: true,
          bgCover: true,
        },
      });

      return { url };
    },
    {
      response: {
        200: t.Object({ url: t.String() }),
        400: t.Object({ error: t.String() }),
        401: t.Object({ error: t.String() }),
        500: t.Object({ error: t.String() }),
      },
    }
  )
  .post(
    "/upload-avatar",
    async ({ headers, request }) => {
      const token = getTokenFromHeader(headers);
      if (!token) throw new Error("Unauthorized");

      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const { userId } = payload as { userId: number; role: string };

      const formData = await request.formData();
      const file = formData.get("avatar") as File | null;
      if (!file) throw new Error("File not uploaded");

      await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });

      const sanitizedFileName = `${Date.now()}-${file.name.replace(
        /\s+/g,
        "-"
      )}`;
      const filePath = join(UPLOAD_DIR, sanitizedFileName);

      try {
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
      } catch (error) {
        console.error("Error saving file:", error);
        throw new Error("Failed to save file");
      }

      const url = `http://localhost:3050/uploads/${sanitizedFileName}`;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatarURL: url },
        select: {
          id: true,
          avatarURL: true,
        },
      });

      return { url };
    },
    {
      response: {
        200: t.Object({ url: t.String() }),
        400: t.Object({ error: t.String() }),
        401: t.Object({ error: t.String() }),
        500: t.Object({ error: t.String() }),
      },
    }
  );

export default userRoutes;
