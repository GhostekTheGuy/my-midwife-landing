"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { motion, AnimatePresence } from "motion/react"
import { Check, Heart, Stethoscope } from "lucide-react"
import Confetti from "react-confetti"
import { useEffect, useState } from "react"
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
import Link from "next/link"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  userType: z.enum(["patient", "midwife"], {
    required_error: "Wybierz typ użytkownika",
  }),
  email: z.string().email("Nieprawidłowy adres email"),
  city: z.string().min(2, "Miasto musi mieć co najmniej 2 znaki"),
  privacyConsent: z.boolean({
    required_error: "Musisz wyrazić zgodę na przetwarzanie danych",
  }).refine((val) => val === true, {
    message: "Musisz wyrazić zgodę na przetwarzanie danych",
  }),
  demoTesting: z.boolean().optional(),
})

type FormData = z.infer<typeof formSchema>

interface JoinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinModal({ open, onOpenChange }: JoinModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [hideForm, setHideForm] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted, isValid },
    setValue,
    watch,
    reset,
    clearErrors,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      userType: undefined,
      email: "",
      city: "",
      privacyConsent: false,
      demoTesting: false,
    },
  })

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      reset()
      setIsSuccess(false)
      setShowCheckmark(false)
      setHideForm(false)
      setShowConfetti(false)
      setSubmitError(null)
    }
    onOpenChange(newOpen)
  }

  const userType = watch("userType")
  const privacyConsent = watch("privacyConsent")
  const demoTesting = watch("demoTesting")

  async function onSubmit(data: FormData) {
    // Double-check validation before submitting
    if (!data.privacyConsent) {
      setValue("privacyConsent", false, { shouldValidate: true, shouldTouch: true })
      trigger("privacyConsent")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error || "Wystąpił błąd podczas wysyłania formularza"
        
        // Handle duplicate email error (409 Conflict)
        if (response.status === 409) {
          // Set error on email field
          setValue("email", data.email, { shouldValidate: true, shouldTouch: true })
          trigger("email")
          setSubmitError(errorMessage)
          setIsSubmitting(false)
          return
        }
        
        setSubmitError(errorMessage)
        setIsSubmitting(false)
        return
      }

      const result = await response.json()
      console.log({ success: result })
      
      reset()
      setIsSubmitting(false)
      setShowCheckmark(true)
      setShowConfetti(true)
      
      // Stop confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      
      // After checkmark animation, hide form and show success
      setTimeout(() => {
        setHideForm(true)
        setTimeout(() => {
          setIsSuccess(true)
        }, 300) // Wait for form fade-out
      }, 800) // Show checkmark for 800ms
    } catch (error) {
      console.error({ error })
      setSubmitError("Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.")
      setIsSubmitting(false)
      setShowCheckmark(false)
      setShowConfetti(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showConfetti && windowDimensions.width > 0 && windowDimensions.height > 0 && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          colors={["#e352ad", "#ff69b4", "#ff1493", "#ffb6c1", "#ffc0cb", "#eac9df"]}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
          initialVelocityY={20}
        />
      )}
      <DialogContent className="sm:max-w-[500px]">
        <AnimatePresence mode="wait">
          {isSuccess ? (
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
                onClick={() => handleOpenChange(false)}
                className="bg-[#0b0b0b] text-white hover:bg-[#414141]"
              >
                Zamknij
              </Button>
            </motion.div>
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

              <form onSubmit={handleSubmit(onSubmit, (errors) => {
                console.log({ validationErrors: errors })
                // Ensure privacy consent error is shown
                if (errors.privacyConsent) {
                  setValue("privacyConsent", privacyConsent, { shouldTouch: true, shouldValidate: true })
                  trigger("privacyConsent")
                }
              })} className="space-y-6">
          {/* User Type Selection */}
          <div className="space-y-3">
            <Label className="text-[#0b0b0b]">Jestem:</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue("userType", "patient", {
                    shouldValidate: true,
                    shouldTouch: true,
                  })
                  clearErrors("userType")
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200",
                  "hover:border-[#e352ad] hover:bg-[#fefbfd]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e352ad] focus-visible:ring-offset-2",
                  userType === "patient"
                    ? "border-[#e352ad] bg-[#fefbfd] shadow-sm"
                    : "border-[#EEE] bg-white"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                    userType === "patient"
                      ? "bg-[#e352ad] text-white"
                      : "bg-[#EEE] text-[#989898]"
                  )}
                >
                  <Heart className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    userType === "patient"
                      ? "text-[#0b0b0b]"
                      : "text-[#414141]"
                  )}
                >
                  Pacjentka
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue("userType", "midwife", {
                    shouldValidate: true,
                    shouldTouch: true,
                  })
                  clearErrors("userType")
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200",
                  "hover:border-[#e352ad] hover:bg-[#fefbfd]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e352ad] focus-visible:ring-offset-2",
                  userType === "midwife"
                    ? "border-[#e352ad] bg-[#fefbfd] shadow-sm"
                    : "border-[#EEE] bg-white"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                    userType === "midwife"
                      ? "bg-[#e352ad] text-white"
                      : "bg-[#EEE] text-[#989898]"
                  )}
                >
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    userType === "midwife"
                      ? "text-[#0b0b0b]"
                      : "text-[#414141]"
                  )}
                >
                  Położna
                </span>
              </button>
            </div>
            {errors.userType && (touchedFields.userType || isSubmitted) && (
              <p className="text-sm text-red-500">{errors.userType.message}</p>
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
                  if (submitError) {
                    setSubmitError(null)
                  }
                },
              })}
            />
            {errors.email && (touchedFields.email || isSubmitted) && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
            {submitError && !errors.email && submitError.includes("email") && (
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
            {errors.city && (touchedFields.city || isSubmitted) && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
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
                Wyrażam zgodę na przechowywanie i przetwarzanie moich danych
                osobowych.{" "}
                <Link
                  href="/polityka-prywatnosci"
                  className="text-[#e352ad] hover:underline"
                  target="_blank"
                >
                  Polityka prywatności
                </Link>
              </Label>
            </div>
            {errors.privacyConsent && (touchedFields.privacyConsent || isSubmitted) && (
              <p className="text-sm text-red-500">
                {errors.privacyConsent.message}
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
                Chcę wziąć udział w testach wersji demonstracyjnej
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-[#EEE]"
              disabled={isSubmitting || showCheckmark}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || showCheckmark}
              className={`relative overflow-hidden transition-all duration-300 ${
                showCheckmark
                  ? "bg-[#e352ad] text-white hover:bg-[#e352ad]"
                  : "bg-[#0b0b0b] text-white hover:bg-[#414141]"
              }`}
            >
              <AnimatePresence mode="wait">
                {showCheckmark ? (
                  <motion.div
                    key="checkmark"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="flex items-center justify-center"
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isSubmitting ? "Wysyłanie..." : "Wyślij"}
                  </motion.span>
                )}
              </AnimatePresence>
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

