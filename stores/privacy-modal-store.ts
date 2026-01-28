"use client"

import { create } from "zustand"

interface PrivacyModalStore {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const usePrivacyModalStore = create<PrivacyModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))
