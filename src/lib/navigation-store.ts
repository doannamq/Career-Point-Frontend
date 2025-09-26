import { create } from "zustand"

type NavigationState = {
  isNavigating: boolean
  progress: number
  pendingHref: string | null
  startNavigation: (href: string) => void
  updateProgress: (progress: number) => void
  completeNavigation: () => void
  cancelNavigation: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isNavigating: false,
  progress: 0,
  pendingHref: null,
  startNavigation: (href) => set({ isNavigating: true, pendingHref: href, progress: 0 }),
  updateProgress: (progress) => set({ progress }),
  completeNavigation: () => set({ isNavigating: false, progress: 100 }),
  cancelNavigation: () => set({ isNavigating: false, pendingHref: null, progress: 0 }),
}))
