"use client"

import { PrivacyModal } from "@/components/privacy-modal"
import { usePrivacyModalStore } from "@/stores/privacy-modal-store"

export function PrivacyModalWrapper() {
  const { isOpen, closeModal } = usePrivacyModalStore()
  return <PrivacyModal open={isOpen} onOpenChange={closeModal} />
}
