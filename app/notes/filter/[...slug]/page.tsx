import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import css from "./NotesPage.module.css";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

const APP_NAME = "NoteHub";
const APP_URL = "https://YOUR-DOMAIN.com";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugValue = slug?.[0];

  const activeTag = slugValue === "all" || !slugValue ? "all" : slugValue;

  const title =
    activeTag === "all"
      ? `Усі нотатки | ${APP_NAME}`
      : `Нотатки: ${activeTag} | ${APP_NAME}`;

  const description =
    activeTag === "all"
      ? `Перегляд усіх нотаток у ${APP_NAME}.`
      : `Перегляд нотаток у ${APP_NAME} з за тегом: ${activeTag}.`;

  const url =
    activeTag === "all"
      ? `${APP_URL}/notes`
      : `${APP_URL}/notes/filter/${activeTag}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function MainNotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugValue = slug?.[0];

  const activeTag = slugValue === "all" || !slugValue ? undefined : slugValue;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", activeTag],
    queryFn: () => fetchNotes(1, "", activeTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={css.app}>
        <NotesClient activeTag={activeTag} />
      </div>
    </HydrationBoundary>
  );
}
