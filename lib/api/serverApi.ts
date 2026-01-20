"use server";
import type { User } from "../../types/user";
import type { Note } from "@/types/note";
import { cookies } from "next/headers";
import { api } from "./api";

const getServerApi = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  return {
    headers: {
      cookie: cookieString,
    },
  };
};

interface NoteRes {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  currentPage: number,
  query?: string,
  tag?: string,
): Promise<NoteRes> {
  const serverApi = await getServerApi();
  const res = await api.get<NoteRes>("/notes", {
    ...serverApi,
    params: { page: currentPage, perPage: 12, search: query, tag: tag },
  });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const serverApi = await getServerApi();
  const res = await api.get<Note>("/notes" + `/${id}`, serverApi);

  return res.data;
}

export const getMe = async () => {
  const serverApi = await getServerApi();
  const res = await api.get<User>("/users/me", serverApi);
  return res.data;
};

export const checkSession = async (externalCookie?: string) => {
  const cookieString = externalCookie || (await cookies()).toString();

  const res = await api.get<string>("/auth/session", {
    headers: { Cookie: cookieString },
  });
  return res;
};
