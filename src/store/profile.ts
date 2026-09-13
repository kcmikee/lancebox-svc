import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ProfileRole = "business" | "individual";

type ProfileState = {
  logoUri: string | null;
  role: ProfileRole | null;
  setLogoUri: (uri: string | null) => void;
  setRole: (role: ProfileRole) => void;
};

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      logoUri: null,
      role: null,
      setLogoUri: (logoUri) => set({ logoUri }),
      setRole: (role) => set({ role }),
    }),
    {
      name: "lancebox-profile",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
