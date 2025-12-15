"use client"

import { JoinModal } from "@/components/join-modal"
import { useJoinModal } from "@/contexts/join-modal-context"

export function JoinModalWrapper() {
  const { isOpen, closeModal } = useJoinModal()
  return <JoinModal open={isOpen} onOpenChange={closeModal} />
}

