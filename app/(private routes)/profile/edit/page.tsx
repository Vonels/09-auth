"use client";

import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import css from "./EditProfilePage.module.css";

import { getMe, updateMe } from "@/lib/api/clientApi";

export default function EditProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const usernameRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
      router.push("/profile");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!user) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = usernameRef.current?.value.trim() ?? "";
    if (!username) return;

    updateMutation.mutate({ username });
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={user.avatarUrl}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              ref={usernameRef}
              id="username"
              type="text"
              defaultValue={user.username ?? ""}
              className={css.input}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
              disabled={updateMutation.isPending}
            >
              Cancel
            </button>
          </div>

          {updateMutation.isError ? (
            <p className={css.errorText}>Failed to save. Try again.</p>
          ) : null}
        </form>
      </div>
    </main>
  );
}
