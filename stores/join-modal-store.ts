"use client"

import { create } from "zustand"

interface JoinModalStore {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useJoinModalStore = create<JoinModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))

