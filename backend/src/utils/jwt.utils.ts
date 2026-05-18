import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Role } from "@prisma/client";

export interface TokenUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthTokenPayload extends JwtPayload {
  user: TokenUser;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN ?? "7d";
}

export function signToken(payload: AuthTokenPayload): string {
  const expiresIn = getJwtExpiresIn() as jwt.SignOptions["expiresIn"];

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  });
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded as AuthTokenPayload;
}
