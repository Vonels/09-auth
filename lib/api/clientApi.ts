import { api } from "./api";
import type { Note, NoteFormValues } from "@/types/note";
import type { User } from "@/types/user";

interface NoteRes {
  notes: Note[];
  totalPages: number;
}

type RegisterRequest = {
  user: User;
};

export type LoginRequest = {
  email: string;
  password: string;
};

type CheckSessionRequest = {
  success: boolean;
};

const url = "https://notehub-public.goit.study/api/notes";

export async function fetchNotes(
  currentPage: number,
  query?: string,
  tag?: string
): Promise<NoteRes> {
  const res = await api.get<NoteRes>(url, {
    params: { page: currentPage, perPage: 12, search: query, tag: tag },
  });
  return res.data;
}

export async function createNote(values: NoteFormValues): Promise<Note> {
  const res = await api.post<Note>(url, values);

  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(url + `/${id}`);

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(url + `/${id}`);

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
  const { data } = await api.get<User>("/auth/me");
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
