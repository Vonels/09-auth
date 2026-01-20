import { api } from "./api";
import type { Note, NoteFormValues } from "@/types/note";
import type { User } from "@/types/user";

interface NoteRes {
  notes: Note[];
  totalPages: number;
}

type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

type CheckSessionRequest = {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
};

export type UpdateMeRequest = {
  username: string;
};

export async function fetchNotes(
  currentPage: number,
  query?: string,
  tag?: string,
): Promise<NoteRes> {
  const res = await api.get<NoteRes>("/notes", {
    params: { page: currentPage, perPage: 12, search: query, tag: tag },
  });
  return res.data;
}

export async function createNote(values: NoteFormValues): Promise<Note> {
  const res = await api.post<Note>("/notes", values);

  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>("/notes" + `/${id}`);

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>("/notes" + `/${id}`);

  return res.data;
}

export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const checkSession = async () => {
  const res = await api.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const updateMe = async (data: UpdateMeRequest) => {
  const res = await api.patch<User>("/users/me", data);
  return res.data;
};
