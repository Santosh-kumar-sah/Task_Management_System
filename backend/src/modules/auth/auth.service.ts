import { Prisma, type Role } from "@prisma/client";
import { prisma } from "../../config/db";
import { comparePassword, hashPassword } from "../../utils/hash.utils";
import { HttpError } from "../../utils/httpError";
import { signToken, type TokenUser } from "../../utils/jwt.utils";
import type { LoginInput, RegisterInput } from "./auth.schema";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

type UserWithPassword = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    password: true;
    role: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

function buildTokenUser(user: PublicUser): TokenUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
  };
}

function formatAuthResponse(user: PublicUser) {
  return {
    user,
    token: signToken({ user: buildTokenUser(user) }),
  };
}

async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    throw new HttpError("A user with this email already exists", 400);
  }

  const hashedPassword = await hashPassword(input.password);

  let user: PublicUser;

  try {
    user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
      select: publicUserSelect,
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002") {
      throw new HttpError("A user with this email already exists", 400);
    }

    throw error;
  }

  return formatAuthResponse(user);
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new HttpError("Invalid email or password", 401);
  }

  const passwordMatches = await comparePassword(input.password, user.password);

  if (!passwordMatches) {
    throw new HttpError("Invalid email or password", 401);
  }

  const { password: _password, ...safeUser } = user;
  return formatAuthResponse(safeUser);
}
