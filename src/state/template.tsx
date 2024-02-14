import create from "zustand";

export interface MemeTemplateState {
  source: Blob | string | undefined;
  setSource: (value: Blob | string) => void;
  reset: () => void;
}

const useMemeTemplateStore = create<MemeTemplateState>((set) => ({
  source: undefined,
  setSource: (value: Blob | string) => set({ source: value }),
  reset: () => set({ source: undefined }),
}));

export default useMemeTemplateStore;
