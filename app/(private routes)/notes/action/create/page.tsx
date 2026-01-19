import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

const APP_NAME = "NoteHub";
const APP_URL = "https://09-auth-mauve-omega.vercel.app";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: `Create note | ${APP_NAME}`,
  description: `Create a new note in ${APP_NAME}.`,
  openGraph: {
    title: `Create note | ${APP_NAME}`,
    description: `Create a new note in ${APP_NAME}.`,
    url: `${APP_URL}/notes/action/create`,
    images: [{ url: OG_IMAGE }],
    type: "website",
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
