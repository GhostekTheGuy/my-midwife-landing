"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog"

interface PrivacyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0b0b0b]">
            Polityka Prywatności
          </DialogTitle>
        </DialogHeader>
        <div className="h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-6 text-[#414141] text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-[#0b0b0b] mb-2">
                1. Administrator danych
              </h3>
              <p>
                Administratorem Twoich danych osobowych jest MyMidwife Sp. z o.o.
                z siedzibą w Polsce, NIP: 5372694237, REGON: 54383309900000,
                KRS: 0001220264.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#0b0b0b] mb-2">
                2. Cele przetwarzania danych
              </h3>
              <p>Twoje dane osobowe przetwarzamy w celu:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Rejestracji i obsługi konta użytkownika</li>
                <li>Kontaktu w sprawie usług platformy MyMidwife</li>
                <li>Informowania o nowościach i aktualizacjach</li>
                <li>Prowadzenia testów wersji pilotażowej (za zgodą)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#0b0b0b] mb-2">
                3. Zakres zbieranych danych
              </h3>
              <p>Zbieramy następujące dane:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Adres e-mail</li>
                <li>Miasto zamieszkania</li>
                <li>Typ użytkownika (pacjentka/położna)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#0b0b0b] mb-2">
                4. Podstawa prawna
              </h3>
              <p>
                Dane przetwarzamy na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO)
                oraz w celu wykonania umowy o świadczenie usług (art. 6 ust. 1 lit. b RODO).
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#0b0b0b] mb-2">
                5. Okres przechowywania danych
              </h3>
              <p>
                Twoje dane będą przechowywane do momentu wycofania zgody lub
                zakończenia korzystania z usług platformy, a następnie przez okres
                wymagany przepisami prawa.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#0b0b0b] mb-2">
                6. Twoje prawa
              </h3>
              <p>Masz prawo do:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Dostępu do swoich danych</li>
                <li>Sprostowania danych</li>
                <li>Usunięcia danych</li>
                <li>Ograniczenia przetwarzania</li>
                <li>Przenoszenia danych</li>
                <li>Wniesienia sprzeciwu</li>
                <li>Cofnięcia zgody w dowolnym momencie</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#0b0b0b] mb-2">
                7. Kontakt
              </h3>
              <p>
                W sprawach związanych z ochroną danych osobowych możesz skontaktować
                się z nami poprzez nasze kanały social media lub formularz kontaktowy
                na stronie.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#0b0b0b] mb-2">
                8. Zmiany w polityce prywatności
              </h3>
              <p>
                Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej polityce
                prywatności. O wszelkich zmianach będziemy informować na stronie
                internetowej.
              </p>
            </section>

            <p className="text-xs text-[#666666] pt-4">
              Ostatnia aktualizacja: styczeń 2026
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
