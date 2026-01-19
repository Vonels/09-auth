import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

const APP_NAME = "NoteHub";
const APP_URL = "https://09-auth-mauve-omega.vercel.app";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const note = await fetchNoteById(id);

  const titleText = note?.title || "Нотатка";
  const descriptionText =
    note?.content?.slice(0, 140) || `Деталі нотатки у ${APP_NAME}.`;

  const title = `${titleText} | ${APP_NAME}`;
  const url = `${APP_URL}/notes/${id}`;

  return {
    title,
    description: descriptionText,
    openGraph: {
      title,
      description: descriptionText,
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

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
