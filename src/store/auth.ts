import { create } from "zustand";

type Session = { userId: string } | null;

type AuthState = {
  session: Session;
  isLoading: boolean;
  signIn: (session: NonNullable<Session>) => void;
  signOut: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  session: null,
  isLoading: false,
  signIn: (session) => set({ session }),
  signOut: () => set({ session: null }),
}));
