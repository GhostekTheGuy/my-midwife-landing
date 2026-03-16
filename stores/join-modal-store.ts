"use client"

import { create } from "zustand"
import posthog from "posthog-js"

interface JoinModalStore {
  isOpen: boolean
  openModal: (source?: string) => void
  closeModal: () => void
}

export const useJoinModalStore = create<JoinModalStore>((set) => ({
  isOpen: false,
  openModal: (source) => {
    posthog.capture("form_modal_opened", { source })
    set({ isOpen: true })
  },
  closeModal: () => set({ isOpen: false }),
}))

