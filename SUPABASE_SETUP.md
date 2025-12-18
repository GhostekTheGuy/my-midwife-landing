# Konfiguracja Supabase

## Krok 1: Utwórz projekt w Supabase

1. Przejdź do [https://supabase.com](https://supabase.com)
2. Zaloguj się lub utwórz konto
3. Kliknij "New Project"
4. Wypełnij dane projektu i wybierz region
5. Poczekaj na utworzenie projektu (około 2 minut)

## Krok 2: Skopiuj klucze API

1. W projekcie Supabase, przejdź do **Settings** → **API**
2. Skopiuj:
   - **Project URL** (np. `https://xxxxx.supabase.co`)
   - **anon/public key** (klucz zaczynający się od `eyJ...`)

## Krok 3: Utwórz plik .env.local

W głównym katalogu projektu utwórz plik `.env.local` z następującą zawartością:

```env
NEXT_PUBLIC_SUPABASE_URL=twoj_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_anon_key
```

**Przykład:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.example
```

## Krok 4: Utwórz tabelę w Supabase

1. W projekcie Supabase, przejdź do **SQL Editor**
2. Kliknij **New Query**
3. Skopiuj i wklej zawartość pliku `supabase-schema.sql`
4. Kliknij **Run** (lub naciśnij Ctrl+Enter)

To utworzy tabelę `form_submissions` z odpowiednimi kolumnami i uprawnieniami.

## Krok 5: Sprawdź konfigurację

1. Uruchom serwer deweloperski: `pnpm dev`
2. Wypełnij formularz na stronie
3. Sprawdź w Supabase → **Table Editor** → **form_submissions**, czy dane się zapisały

## Alternatywa: Neon Database

Jeśli wolisz użyć Neon zamiast Supabase:

1. Utwórz projekt na [https://neon.tech](https://neon.tech)
2. Skopiuj connection string
3. Zainstaluj Prisma: `pnpm add prisma @prisma/client`
4. Skonfiguruj Prisma z connection string z Neon
5. Zaktualizuj `app/api/submit-form/route.ts`, aby używał Prisma zamiast Supabase

## Rozwiązywanie problemów

### Błąd: "Missing Supabase environment variables"
- Upewnij się, że plik `.env.local` istnieje w głównym katalogu projektu
- Sprawdź, czy zmienne zaczynają się od `NEXT_PUBLIC_`
- Zrestartuj serwer deweloperski po dodaniu zmiennych środowiskowych

### Błąd: "relation 'form_submissions' does not exist"
- Upewnij się, że uruchomiłeś SQL z pliku `supabase-schema.sql` w SQL Editor
- Sprawdź, czy tabela istnieje w **Table Editor**

### Błąd: "new row violates row-level security policy"
- Sprawdź, czy polityki RLS są poprawnie skonfigurowane
- W SQL Editor możesz tymczasowo wyłączyć RLS: `ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;` (tylko do testów!)

