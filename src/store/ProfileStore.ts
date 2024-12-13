import { create } from 'zustand';

interface ProfileState {
  email: string | null;
  emailVerified: boolean;
  organizationId: number | null;
  postageBatchId?: string | null;
  setProfile: (profile: ProfileState) => void;
  setEmailVerified: (verified: boolean) => void;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  email: null,
  emailVerified: false,
  postageBatchId: null,
  organizationId: null,
  setProfile: (profile: ProfileState) => set(() => profile),
  setEmailVerified: (verified: boolean) => set(() => ({ emailVerified: verified })),
  clear: () =>
    set(() => ({
      email: null,
      organizationId: null,
      emailVerified: false,
      postageBatchId: null,
    })),
}));
