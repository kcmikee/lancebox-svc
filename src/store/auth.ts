import { create } from "zustand";

type Session = { userId: string } | null;

type AuthState = {
  session: Session;
  isLoading: boolean;
  signIn: (session: NonNullable<Session>) => void;
  signOut: () => void;
};

const SIGN_IN_TRANSITION_MS = 900;

export const useAuth = create<AuthState>((set) => ({
  session: null,
  isLoading: false,
  signIn: (session) => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ session, isLoading: false });
    }, SIGN_IN_TRANSITION_MS);
  },
  signOut: () => set({ session: null }),
}));
