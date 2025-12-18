"use client"

import { JoinModal } from "@/components/join-modal"
import { useJoinModalStore } from "@/stores/join-modal-store"

export function JoinModalWrapper() {
  const { isOpen, closeModal } = useJoinModalStore()
  return <JoinModal open={isOpen} onOpenChange={closeModal} />
}

