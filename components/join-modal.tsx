"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { motion, AnimatePresence } from "motion/react"
import { Heart, Stethoscope, LucideIcon } from "lucide-react"
import Confetti from "react-confetti"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useWindowDimensions } from "@/hooks/use-window-dimensions"
import { usePrivacyModalStore } from "@/stores/privacy-modal-store"

// ============================================================================
// Schema & Types
// ============================================================================

const formSchema = z.object({
  userType: z.enum(["patient", "midwife"], {
    required_error: "Wybierz typ użytkownika",
  }),
  email: z.string().email("Nieprawidłowy adres email"),
  city: z.string().min(2, "Miasto musi mieć co najmniej 2 znaki"),
  privacyConsent: z
    .boolean({
      required_error: "Musisz wyrazić zgodę na przetwarzanie danych",
    })
    .refine((val) => val === true, {
      message: "Musisz wyrazić zgodę na przetwarzanie danych",
    }),
  demoTesting: z.boolean().optional(),
})

type FormData = z.infer<typeof formSchema>
type UserType = "patient" | "midwife"

interface JoinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ============================================================================
// User Type Configuration
// ============================================================================

interface UserTypeOption {
  value: UserType
  label: string
  icon: LucideIcon
}

const USER_TYPE_OPTIONS: UserTypeOption[] = [
  { value: "patient", label: "Pacjentka", icon: Heart },
  { value: "midwife", label: "Położna", icon: Stethoscope },
]

// ============================================================================
// Sub-Components
// ============================================================================

interface UserTypeButtonProps {
  option: UserTypeOption
  isSelected: boolean
  onSelect: () => void
}

function UserTypeButton({ option, isSelected, onSelect }: UserTypeButtonProps) {
  const Icon = option.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200",
        "hover:border-[#e352ad] hover:bg-[#fefbfd]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e352ad] focus-visible:ring-offset-2",
        isSelected
          ? "border-[#e352ad] bg-[#fefbfd] shadow-sm"
          : "border-[#EEE] bg-white"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200",
          isSelected ? "bg-[#e352ad] text-white" : "bg-[#EEE] text-[#989898]"
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          isSelected ? "text-[#0b0b0b]" : "text-[#414141]"
        )}
      >
        {option.label}
      </span>
    </button>
  )
}

interface SuccessScreenProps {
  onClose: () => void
}

function SuccessScreen({ onClose }: SuccessScreenProps) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-8 px-4 text-center"
    >
      <h2 className="text-2xl font-bold text-[#0b0b0b] mb-6">
        Dziękujemy, że jesteś z nami
      </h2>
      <div className="w-full max-w-[300px] h-[300px] mb-6">
        <DotLottieReact
          src="https://lottie.host/1d7315c8-d151-4369-8df6-9468ae254f69/MuUMJcouaD.lottie"
          loop
          autoplay
        />
      </div>
      <Button
        onClick={onClose}
        className="bg-[#0b0b0b] text-white hover:bg-[#414141]"
      >
        Zamknij
      </Button>
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function JoinModal({ open, onOpenChange }: JoinModalProps) {
  const { openModal: openPrivacyModal } = usePrivacyModalStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hideForm, setHideForm] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const windowDimensions = useWindowDimensions()

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
    setValue,
    watch,
    reset,
    clearErrors,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      userType: undefined,
      email: "",
      city: "",
      privacyConsent: false,
      demoTesting: false,
    },
  })

  const userType = watch("userType")
  const privacyConsent = watch("privacyConsent")
  const demoTesting = watch("demoTesting")

  function resetModalState() {
    reset()
    setIsSuccess(false)
    setHideForm(false)
    setShowConfetti(false)
    setSubmitError(null)
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      resetModalState()
    }
    onOpenChange(newOpen)
  }

  function handleUserTypeSelect(type: UserType) {
    setValue("userType", type, { shouldValidate: true, shouldTouch: true })
    clearErrors("userType")
  }

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          _meta: {
            eventSourceUrl: window.location.href,
            clientUserAgent: navigator.userAgent,
            eventId: crypto.randomUUID(),
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage =
          errorData.error || "Wystąpił błąd podczas wysyłania formularza"

        if (response.status === 409) {
          setValue("email", data.email, {
            shouldValidate: true,
            shouldTouch: true,
          })
          trigger("email")
        }

        setSubmitError(errorMessage)
        setIsSubmitting(false)
        return
      }

      // Success flow
      reset()
      setIsSubmitting(false)
      setShowConfetti(true)
      setHideForm(true)
      setIsSuccess(true)

      setTimeout(() => setShowConfetti(false), 3000)
    } catch {
      setSubmitError(
        "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie."
      )
      setIsSubmitting(false)
      setShowConfetti(false)
    }
  }

  const showFieldError = (field: keyof FormData) =>
    errors[field] && (touchedFields[field] || isSubmitted)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showConfetti &&
        windowDimensions.width > 0 &&
        windowDimensions.height > 0 && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            colors={[
              "#e352ad",
              "#ff69b4",
              "#ff1493",
              "#ffb6c1",
              "#ffc0cb",
              "#eac9df",
            ]}
            numberOfPieces={200}
            recycle={false}
            gravity={0.3}
            initialVelocityY={20}
          />
        )}

      <DialogContent className="sm:max-w-[500px]">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <SuccessScreen onClose={() => handleOpenChange(false)} />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              animate={{ opacity: hideForm ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#0b0b0b]">
                  Dołącz do MyMidwife
                </DialogTitle>
                <DialogDescription className="text-[#414141]">
                  Wypełnij formularz, aby dołączyć do naszej społeczności
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label className="text-[#0b0b0b]">Jestem:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {USER_TYPE_OPTIONS.map((option) => (
                      <UserTypeButton
                        key={option.value}
                        option={option}
                        isSelected={userType === option.value}
                        onSelect={() => handleUserTypeSelect(option.value)}
                      />
                    ))}
                  </div>
                  {showFieldError("userType") && (
                    <p className="text-sm text-red-500">
                      {errors.userType?.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#0b0b0b]">
                    Email:
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj@email.pl"
                    {...register("email", {
                      onBlur: () => trigger("email"),
                      onChange: () => {
                        if (submitError) setSubmitError(null)
                      },
                    })}
                  />
                  {showFieldError("email") && (
                    <p className="text-sm text-red-500">
                      {errors.email?.message}
                    </p>
                  )}
                  {submitError &&
                    !errors.email &&
                    submitError.includes("email") && (
                      <p className="text-sm text-red-500">{submitError}</p>
                    )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[#0b0b0b]">
                    Miasto:
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Warszawa"
                    {...register("city", {
                      onBlur: () => trigger("city"),
                    })}
                  />
                  {showFieldError("city") && (
                    <p className="text-sm text-red-500">
                      {errors.city?.message}
                    </p>
                  )}
                </div>

                {/* Privacy Consent */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacyConsent"
                      checked={privacyConsent}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true
                        setValue("privacyConsent", isChecked, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                        if (isChecked) {
                          clearErrors("privacyConsent")
                        } else {
                          trigger("privacyConsent")
                        }
                      }}
                      className="mt-1"
                    />
                    <Label
                      htmlFor="privacyConsent"
                      className="text-sm font-normal leading-relaxed cursor-pointer text-[#0b0b0b]"
                    >
                      Wyrażam zgodę na przechowywanie i przetwarzanie moich
                      danych osobowych.{" "}
                      <button
                        type="button"
                        onClick={openPrivacyModal}
                        className="text-[#e352ad] hover:underline"
                      >
                        Polityka prywatności
                      </button>
                    </Label>
                  </div>
                  {showFieldError("privacyConsent") && (
                    <p className="text-sm text-red-500">
                      {errors.privacyConsent?.message}
                    </p>
                  )}
                </div>

                {/* Demo Testing Consent */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="demoTesting"
                      checked={demoTesting}
                      onCheckedChange={(checked) =>
                        setValue("demoTesting", checked === true)
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor="demoTesting"
                      className="text-sm font-normal leading-relaxed cursor-pointer text-[#0b0b0b]"
                    >
                      Chcę wziąć udział w testach wersji pilotażowej
                    </Label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    className="border-[#EEE]"
                    disabled={isSubmitting}
                  >
                    Anuluj
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0b0b0b] text-white hover:bg-[#414141]"
                  >
                    {isSubmitting ? "Wysyłanie..." : "Wyślij"}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
