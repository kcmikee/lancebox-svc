import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Session = { userId: string } | null;

type AuthState = {
  session: Session;
  isLoading: boolean;
  hasHydrated: boolean;
  signIn: (session: NonNullable<Session>) => void;
  signOut: () => void;
};

const SIGN_IN_TRANSITION_MS = 900;

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isLoading: false,
      hasHydrated: false,
      signIn: (session) => {
        set({ isLoading: true });
        setTimeout(() => {
          set({ session, isLoading: false });
        }, SIGN_IN_TRANSITION_MS);
      },
      signOut: () => set({ session: null }),
    }),
    {
      name: "lancebox-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
