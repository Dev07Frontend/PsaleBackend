import { Elysia, t } from "elysia";
import prisma from "../../lib/prisma";
import * as argon2 from "argon2";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({ body, set }) => {
      const { email, password, firstName, lastName, avatarURL, bgCover } = body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        set.status = 400;
        return { error: "Электронная почта, которая уже используется" };
      }

      const passwordHash = await argon2.hash(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          firstName,
          lastName,
          role: "STUDENT",
          avatarURL,
          bgCover,
        },
      });

      const secret = new TextEncoder().encode(JWT_SECRET);
      const token = await new SignJWT({ userId: user.id, role: user.role })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(secret);

      return { user, token };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
        firstName: t.String(),
        lastName: t.String(),
        avatarURL: t.Optional(t.String()),
        bgCover: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      const { email, password, rememberMe = false } = body;

      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user || !(await argon2.verify(user.password, password))) {
        set.status = 401;
        return { error: "Неверные учетные данные" };
      }

      const tokenExpiresIn = rememberMe ? "7d" : "1h";
      const secret = new TextEncoder().encode(JWT_SECRET);
      const token = await new SignJWT({ userId: user.id, role: user.role })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(tokenExpiresIn)
        .sign(secret);

      return { user, token };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
        rememberMe: t.Optional(t.Boolean()),
      }),
    }
  );

export default authRoutes;
