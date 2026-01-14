import { create } from "zustand";

export type User = {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: true,
    })),

  clearIsAuthenticated: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
    })),
}));
