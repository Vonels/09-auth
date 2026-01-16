import axios from "axios";
import type { User } from "../../types/user";
import type { Note } from "@/types/note";
import { cookies } from "next/headers";

const baseURL = "https://notehub-public.goit.study/api";
const TOKEN_COOKIE = "NoteHub";

export const getServerApi = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  return axios.create({
    baseURL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

interface NoteRes {
  notes: Note[];
  totalPages: number;
}

type CheckSessionRequest = {
  success: boolean;
};

export async function fetchNotes(
  currentPage: number,
  query?: string,
  tag?: string
): Promise<NoteRes> {
  const api = await getServerApi();
  const res = await api.get<NoteRes>("/notes", {
    params: { page: currentPage, perPage: 12, search: query, tag: tag },
  });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const api = await getServerApi();
  const res = await api.get<Note>("/notes" + `/${id}`);

  return res.data;
}

export const getMe = async () => {
  const api = await getServerApi();
  const { data } = await api.get<User>("/auth/me");
  return data;
};

export const checkSession = async () => {
  const api = await getServerApi();
  const res = await api.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};
