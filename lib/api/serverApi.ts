import "server-only";
import { cookies } from "next/headers";
import { api } from "./api";
import { User } from "@/types/user";
import type { Note, FetchNotesParams } from "@/types/note";
import { AxiosResponse } from "axios";

export const fetchNotes = async (params: FetchNotesParams): Promise<Note[]> => {
  const cookieStore = await cookies();
  const { data } = await api.get<Note[]>("/notes", {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const checkSession = async (): Promise<AxiosResponse> => {
  const cookieStore = await cookies();
  return await api.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
};

export const getMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const { data } = await api.get<User>("/users/me", {
      headers: { Cookie: cookieStore.toString() },
    });
    return data;
  } catch {
    return null;
  }
};
