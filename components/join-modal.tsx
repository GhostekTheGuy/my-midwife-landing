"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const formSchema = z.object({
  userType: z.enum(["patient", "midwife"], {
    required_error: "Wybierz typ użytkownika",
  }),
  email: z.string().email("Nieprawidłowy adres email"),
  city: z.string().min(2, "Miasto musi mieć co najmniej 2 znaki"),
  privacyConsent: z.boolean().refine((val) => val === true, {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
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
    }
    onOpenChange(newOpen)
  }

  const userType = watch("userType")
  const privacyConsent = watch("privacyConsent")
  const demoTesting = watch("demoTesting")

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    try {
      // Here you would typically send the data to your API
      console.log({ formData: data })
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      reset()
      handleOpenChange(false)
    } catch (error) {
      console.error({ error })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
            <RadioGroup
              value={userType}
              onValueChange={(value) =>
                setValue("userType", value as "patient" | "midwife", {
                  shouldValidate: true,
                })
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="patient" id="patient" />
                <Label
                  htmlFor="patient"
                  className="font-normal cursor-pointer text-[#0b0b0b]"
                >
                  Pacjentka
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="midwife" id="midwife" />
                <Label
                  htmlFor="midwife"
                  className="font-normal cursor-pointer text-[#0b0b0b]"
                >
                  Położna
                </Label>
              </div>
            </RadioGroup>
            {errors.userType && (
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
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
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
              {...register("city")}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* Privacy Consent */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacyConsent"
                checked={privacyConsent}
                onCheckedChange={(checked) =>
                  setValue("privacyConsent", checked === true, {
                    shouldValidate: true,
                  })
                }
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
            {errors.privacyConsent && (
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
      </DialogContent>
    </Dialog>
  )
}

