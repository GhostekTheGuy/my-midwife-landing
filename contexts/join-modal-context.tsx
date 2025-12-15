"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface JoinModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const JoinModalContext = createContext<JoinModalContextType | undefined>(
  undefined
)

export function JoinModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <JoinModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </JoinModalContext.Provider>
  )
}

export function useJoinModal() {
  const context = useContext(JoinModalContext)
  if (context === undefined) {
    throw new Error("useJoinModal must be used within a JoinModalProvider")
  }
  return context
}

