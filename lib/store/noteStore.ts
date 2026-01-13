import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NoteDraft = {
  title: string;
  content: string;
  tag: string;
};

export const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteStore = {
  draft: NoteDraft;
  setDraft: (note: NoteDraft) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set({ draft: note }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub_draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
