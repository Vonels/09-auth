import axios from "axios";
import type { User } from "../../types/user";
import type { Note } from "@/types/note";
import { cookies } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const getServerApi = () => {
  const cookieStore = cookies();
  const cookieString = cookieStore.toString();
  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieString,
    },
  });
};

interface NoteRes {
  notes: Note[];
  totalPages: number;
}

type CheckSessionRequest = {
  success: boolean;
};

const url = "https://notehub-public.goit.study/api/notes";

export async function fetchNotes(
  currentPage: number,
  query?: string,
  tag?: string
): Promise<NoteRes> {
  const api = getServerApi();
  const res = await api.get<NoteRes>(url, {
    params: { page: currentPage, perPage: 12, search: query, tag: tag },
  });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const api = getServerApi();
  const res = await api.get<Note>(url + `/${id}`);

  return res.data;
}

export const getMe = async () => {
  const api = getServerApi();
  const { data } = await api.get<User>("/auth/me");
  return data;
};

export const checkSession = async () => {
  const api = getServerApi();
  const res = await api.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};
