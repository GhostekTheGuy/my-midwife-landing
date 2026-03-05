-- Run this SQL in your Supabase SQL Editor
-- Creates tables for the drip email system

-- 1. Email templates table (editable via Supabase Dashboard)
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'midwife')),
  email_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_type, email_key)
);

-- 2. Sent emails tracking table
CREATE TABLE IF NOT EXISTS sent_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
  email_key TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, email_key)
);

CREATE INDEX IF NOT EXISTS idx_sent_emails_submission_id ON sent_emails(submission_id);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_templates (read-only for anon)
CREATE POLICY "Allow reads for email_templates" ON email_templates
  FOR SELECT TO anon, authenticated
  USING (true);

-- RLS policies for sent_emails
CREATE POLICY "Allow inserts for sent_emails" ON sent_emails
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow reads for sent_emails" ON sent_emails
  FOR SELECT TO anon, authenticated
  USING (true);

-- Allow SELECT on form_submissions for cron query
CREATE POLICY "Allow reads for form_submissions" ON form_submissions
  FOR SELECT TO anon, authenticated
  USING (true);

-- =============================================
-- SEED: Insert default email templates
-- You can edit these anytime in Supabase Dashboard > Table Editor > email_templates
-- body_html is the inner content - it gets wrapped in a branded layout automatically
-- =============================================

-- PATIENT templates
INSERT INTO email_templates (user_type, email_key, subject, body_html) VALUES
('patient', 'welcome', 'Witaj w MyMidwife! Cieszymy sie, ze jestes z nami', '
  <h2 style="font-size:20px;">Czesc!</h2>
  <p>Dziekujemy za dolaczenie do listy oczekujacych MyMidwife. Pracujemy nad aplikacja, ktora polaczy Cie z najlepsza polozna w Twojej okolicy.</p>
  <p>Jestes jedna z pierwszych osob, ktore dowiedza sie o starcie aplikacji. Bedziesz miala dostep do:</p>
  <ul style="line-height:1.8;">
    <li>Wyszukiwania poloznych w Twojej okolicy</li>
    <li>Rezerwacji wizyt online</li>
    <li>Bezpiecznej komunikacji z polozna</li>
  </ul>
  <p>Damy Ci znac, jak tylko bedziemy gotowi!</p>
  <p style="margin-top:24px;">Pozdrawiamy,<br/><strong>Zespol MyMidwife</strong></p>
'),
('patient', 'day3', 'Czy wiesz, ze polozna moze Ci pomoc juz w ciazy?', '
  <h2 style="font-size:20px;">Polozna to wiecej niz porod</h2>
  <p>Wiele kobiet nie wie, ze polozna moze towarzyszyc Ci przez cala ciaze, porod i polaczek. To wsparcie, ktore naprawde robi roznice.</p>
  <p>Z MyMidwife bedziesz mogla:</p>
  <ul style="line-height:1.8;">
    <li>Znalezc polozna specjalizujaca sie w Twoich potrzebach</li>
    <li>Umowic sie na wizyte domowa lub online</li>
    <li>Miec kontakt z polozna przez caly okres opieki</li>
  </ul>
  <p>Juz niedlugo to wszystko bedzie mozliwe w jednym miejscu.</p>
  <p style="margin-top:24px;">Pozdrawiamy,<br/><strong>Zespol MyMidwife</strong></p>
'),
('patient', 'day7', 'MyMidwife - jestesmy coraz blizej startu!', '
  <h2 style="font-size:20px;">Dziekujemy za cierpliwosc!</h2>
  <p>Ciezko pracujemy, zeby MyMidwife bylo jak najlepsze dla Ciebie. Jako osoba z listy oczekujacych, bedziesz miala pierwszenstwo dostepu.</p>
  <p>W miedzyczasie, jesli masz pytania lub sugestie &mdash; po prostu odpowiedz na tego maila. Kazda opinia jest dla nas cenna.</p>
  <p style="margin-top:24px;">Do zobaczenia wkrotce!<br/><strong>Zespol MyMidwife</strong></p>
');

-- MIDWIFE templates
INSERT INTO email_templates (user_type, email_key, subject, body_html) VALUES
('midwife', 'welcome', 'Witaj w MyMidwife! Dolacz do naszej spolecznosci poloznych', '
  <h2 style="font-size:20px;">Czesc!</h2>
  <p>Dziekujemy za zainteresowanie MyMidwife. Tworzymy platforme, ktora pomoze Ci dotrzec do wiekszej liczby pacjentek i zarzadzac wizytami w prosty sposob.</p>
  <p>Jako polozna na naszej platformie bedziesz mogla:</p>
  <ul style="line-height:1.8;">
    <li>Stworzyc profesjonalny profil widoczny dla pacjentek</li>
    <li>Zarzadzac kalendarzem wizyt</li>
    <li>Komunikowac sie z pacjentkami przez bezpieczny chat</li>
    <li>Rozwijac swoja praktyke</li>
  </ul>
  <p>Damy Ci znac, jak tylko platforma bedzie gotowa!</p>
  <p style="margin-top:24px;">Pozdrawiamy,<br/><strong>Zespol MyMidwife</strong></p>
'),
('midwife', 'day3', 'Jak MyMidwife pomoze Ci w codziennej pracy?', '
  <h2 style="font-size:20px;">Twoja praktyka, Twoje zasady</h2>
  <p>Wiemy, ze prowadzenie praktyki polozniczej to nie tylko opieka nad pacjentkami. To tez zarzadzanie terminami, dokumentacja i pozyskiwanie nowych pacjentek.</p>
  <p>MyMidwife pomoze Ci:</p>
  <ul style="line-height:1.8;">
    <li>Automatycznie pozyskiwac pacjentki z Twojej okolicy</li>
    <li>Zarzadzac harmonogramem wizyt bez telefonow</li>
    <li>Budowac reputacje dzieki opiniom pacjentek</li>
  </ul>
  <p>Wszystko w jednym miejscu, bez zbednej biurokracji.</p>
  <p style="margin-top:24px;">Pozdrawiamy,<br/><strong>Zespol MyMidwife</strong></p>
'),
('midwife', 'day7', 'MyMidwife - dolacz do grona pierwszych poloznych!', '
  <h2 style="font-size:20px;">Badz jedna z pierwszych!</h2>
  <p>Platforma MyMidwife jest juz prawie gotowa. Polozne, ktore dolacza jako pierwsze, beda mialy:</p>
  <ul style="line-height:1.8;">
    <li>Darmowy dostep w okresie beta</li>
    <li>Wplyw na rozwoj funkcji platformy</li>
    <li>Priorytetowe wsparcie techniczne</li>
  </ul>
  <p>Jesli masz pytania lub pomysly &mdash; odpowiedz na tego maila. Chetnie porozmawiamy!</p>
  <p style="margin-top:24px;">Do zobaczenia wkrotce!<br/><strong>Zespol MyMidwife</strong></p>
');
