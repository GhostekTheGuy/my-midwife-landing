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
import posthog from "posthog-js"

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
        "flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer",
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
        Jesteś z nami!
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
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hideForm, setHideForm] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const windowDimensions = useWindowDimensions()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
    reset,
    clearErrors,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      userType: undefined,
      email: "",
      city: "",
      privacyConsent: true,
      demoTesting: false,
    },
  })

  const userType = watch("userType")
  const privacyConsent = watch("privacyConsent")
  const demoTesting = watch("demoTesting")

  function resetModalState() {
    reset()
    setStep(1)
    setIsSuccess(false)
    setHideForm(false)
    setShowConfetti(false)
    setSubmitError(null)
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen && !isSuccess) {
      const filledFields = [
        userType ? "userType" : null,
        watch("email") ? "email" : null,
        watch("city") ? "city" : null,
      ].filter(Boolean)

      posthog.capture("form_abandoned", {
        step,
        fields_filled: filledFields,
        fields_filled_count: filledFields.length,
      })
    }
    if (!newOpen) {
      resetModalState()
    }
    onOpenChange(newOpen)
  }

  function handleUserTypeSelect(type: UserType) {
    posthog.capture("form_user_type_selected", { user_type: type })
    setValue("userType", type, { shouldValidate: isSubmitted })
    clearErrors("userType")
    setStep(2)
  }

  function handleBack() {
    setStep(1)
  }

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    setSubmitError(null)
    posthog.capture("form_submit_attempted", { user_type: data.userType })

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

        posthog.capture("form_submit_error", {
          status: response.status,
          error: errorMessage,
        })
        setSubmitError(errorMessage)
        setIsSubmitting(false)
        return
      }

      // Track Lead event in Meta Pixel (browser-side)
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead")
      }

      posthog.capture("form_submitted_successfully", {
        user_type: data.userType,
        demo_testing: data.demoTesting,
      })

      // Success flow
      reset()
      setIsSubmitting(false)
      setShowConfetti(true)
      setHideForm(true)
      setIsSuccess(true)

      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error) {
      posthog.capture("form_submit_error", {
        status: "network_error",
        error: error instanceof Error ? error.message : "unknown",
      })
      setSubmitError(
        "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie."
      )
      setIsSubmitting(false)
      setShowConfetti(false)
    }
  }

  const showFieldError = (field: keyof FormData) =>
    errors[field] && isSubmitted

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
                  {step === 1 ? "Kim jesteś?" : "Zaczynamy razem!"}
                </DialogTitle>
                <DialogDescription className="text-[#414141]">
                  {step === 1
                    ? "Wybierz swoją rolę, aby kontynuować."
                    : "Zostaw kontakt – odezwiemy się, gdy wystartujemy w Twoim mieście."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit, (validationErrors) => {
                posthog.capture("form_validation_failed", {
                  error_fields: Object.keys(validationErrors),
                })
              })} className="space-y-6">
                <AnimatePresence mode="wait" initial={false}>
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
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
                        {errors.userType && (
                          <p className="text-sm text-red-500">
                            {errors.userType?.message}
                          </p>
                        )}
                      </div>

                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#0b0b0b]">
                          Email:
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="anna@email.pl"
                          autoFocus
                          {...register("email", {
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
                          placeholder="np. Warszawa"
                          {...register("city")}
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
                                shouldValidate: isSubmitted,
                              })
                              if (isChecked) {
                                clearErrors("privacyConsent")
                              }
                            }}
                            className="mt-1 cursor-pointer"
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
                            className="mt-1 cursor-pointer"
                          />
                          <Label
                            htmlFor="demoTesting"
                            className="text-sm font-normal leading-relaxed cursor-pointer text-[#0b0b0b]"
                          >
                            Chcę testować aplikację jako jedna z pierwszych!
                          </Label>
                        </div>
                      </div>

                      {/* Back & Submit Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          className="h-12 text-base border-[#EEE] text-[#414141] hover:bg-[#fefbfd]"
                        >
                          Wróć
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-[#0b0b0b] text-white hover:bg-[#414141] h-12 text-base"
                        >
                          {isSubmitting ? "Wysyłanie..." : "Dołączam!"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
