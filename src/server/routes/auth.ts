import { Elysia, t } from "elysia";
import prisma from "../../lib/prisma";
import * as argon2 from "argon2";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({ body }) => {
      const { email, password, firstName, lastName, avatarURL, bgCover } = body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return { error: "Email already in use" };
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
    async ({ body }) => {
      const { email, password, rememberMe = false } = body;

      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return { error: "Invalid credentials" };
      }

      const valid = await argon2.verify(user.password, password);
      if (!valid) {
        return { error: "Invalid credentials" };
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
