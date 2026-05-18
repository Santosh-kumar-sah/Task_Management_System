import { createContext, useContext, useState, type ReactNode } from "react";
import type { AxiosError } from "axios";
import api from "../api/axios";

export type Role = "USER" | "ADMIN";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredAuth(): { user: AuthUser | null; token: string | null } {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!storedToken || !storedUser) {
    return { user: null, token: null };
  }

  try {
    return {
      token: storedToken,
      user: JSON.parse(storedUser) as AuthUser,
    };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null };
  }
}

function persistAuth(auth: AuthResponse): void {
  localStorage.setItem("token", auth.token);
  localStorage.setItem("user", JSON.stringify(auth.user));
}

function extractErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message;

    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuth().user);
  const [token, setToken] = useState<string | null>(() => getStoredAuth().token);

  const authenticate = async (endpoint: string, payload: Record<string, string>): Promise<void> => {
    try {
      const response = await api.post<ApiSuccessResponse<AuthResponse>>(`/api/v1/auth/${endpoint}`, payload);
      const authData = response.data.data;
      setToken(authData.token);
      setUser(authData.user);
      persistAuth(authData);
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    await authenticate("login", { email, password });
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    await authenticate("register", { name, email, password });
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
