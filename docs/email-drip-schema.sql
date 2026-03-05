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
-- Styles use brand colors: #e352ad (pink), #0b0b0b (dark), #414141 (medium), #989898 (light)
-- body_html gets wrapped in branded header/footer automatically
INSERT INTO email_templates (user_type, email_key, subject, body_html) VALUES
('patient', 'welcome', 'Witaj w MyMidwife! Cieszymy się, że jesteś z nami', '
  <h2 style="font-size:22px;font-weight:700;color:#0b0b0b;margin:0 0 16px 0;letter-spacing:-0.3px;">Cześć!</h2>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 16px 0;">Dziękujemy za dołączenie do listy oczekujących <strong style="color:#e352ad;">MyMidwife</strong>. Pracujemy nad aplikacją, która połączy Cię z najlepszą położną w Twojej okolicy.</p>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 12px 0;">Jesteś jedną z pierwszych osób, które dowiedzą się o starcie aplikacji. Będziesz miała dostęp do:</p>
  <table style="margin:0 0 20px 0;width:100%;">
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;margin-bottom:6px;">Wyszukiwania położnych w Twojej okolicy</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Rezerwacji wizyt online</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Bezpiecznej komunikacji z położną</td></tr>
  </table>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 24px 0;">Damy Ci znać, jak tylko będziemy gotowi!</p>
  <p style="color:#989898;font-size:14px;margin:0;">Pozdrawiamy,<br/><strong style="color:#0b0b0b;">Zespół MyMidwife</strong></p>
'),
('patient', 'day3', 'Czy wiesz, że położna może Ci pomóc już w ciąży?', '
  <h2 style="font-size:22px;font-weight:700;color:#0b0b0b;margin:0 0 16px 0;letter-spacing:-0.3px;">Położna to więcej niż poród</h2>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 16px 0;">Wiele kobiet nie wie, że położna może towarzyszyć Ci przez całą ciążę, poród i połóg. To wsparcie, które naprawdę robi różnicę.</p>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 12px 0;">Z <strong style="color:#e352ad;">MyMidwife</strong> będziesz mogła:</p>
  <table style="margin:0 0 20px 0;width:100%;">
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Znaleźć położną specjalizującą się w Twoich potrzebach</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Umówić się na wizytę domową lub online</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Mieć kontakt z położną przez cały okres opieki</td></tr>
  </table>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 24px 0;">Już niedługo to wszystko będzie możliwe w jednym miejscu.</p>
  <p style="color:#989898;font-size:14px;margin:0;">Pozdrawiamy,<br/><strong style="color:#0b0b0b;">Zespół MyMidwife</strong></p>
'),
('patient', 'day7', 'MyMidwife – jesteśmy coraz bliżej startu!', '
  <h2 style="font-size:22px;font-weight:700;color:#0b0b0b;margin:0 0 16px 0;letter-spacing:-0.3px;">Dziękujemy za cierpliwość!</h2>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 16px 0;">Ciężko pracujemy, żeby <strong style="color:#e352ad;">MyMidwife</strong> było jak najlepsze dla Ciebie. Jako osoba z listy oczekujących, będziesz miała pierwszeństwo dostępu.</p>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 24px 0;">W międzyczasie, jeśli masz pytania lub sugestie &mdash; po prostu odpowiedz na tego maila. Każda opinia jest dla nas cenna.</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="https://mymidwife.pl" style="display:inline-block;background:#e352ad;color:#ffffff;padding:12px 32px;border-radius:11px;text-decoration:none;font-size:14px;font-weight:600;">Odwiedź mymidwife.pl</a>
  </div>
  <p style="color:#989898;font-size:14px;margin:0;">Do zobaczenia wkrótce!<br/><strong style="color:#0b0b0b;">Zespół MyMidwife</strong></p>
');

-- MIDWIFE templates
INSERT INTO email_templates (user_type, email_key, subject, body_html) VALUES
('midwife', 'welcome', 'Witaj w MyMidwife! Dołącz do naszej społeczności położnych', '
  <h2 style="font-size:22px;font-weight:700;color:#0b0b0b;margin:0 0 16px 0;letter-spacing:-0.3px;">Cześć!</h2>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 16px 0;">Dziękujemy za zainteresowanie <strong style="color:#e352ad;">MyMidwife</strong>. Tworzymy platformę, która pomoże Ci dotrzeć do większej liczby pacjentek i zarządzać wizytami w prosty sposób.</p>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 12px 0;">Jako położna na naszej platformie będziesz mogła:</p>
  <table style="margin:0 0 20px 0;width:100%;">
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Stworzyć profesjonalny profil widoczny dla pacjentek</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Zarządzać kalendarzem wizyt</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Komunikować się z pacjentkami przez bezpieczny chat</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Rozwijać swoją praktykę</td></tr>
  </table>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 24px 0;">Damy Ci znać, jak tylko platforma będzie gotowa!</p>
  <p style="color:#989898;font-size:14px;margin:0;">Pozdrawiamy,<br/><strong style="color:#0b0b0b;">Zespół MyMidwife</strong></p>
'),
('midwife', 'day3', 'Jak MyMidwife pomoże Ci w codziennej pracy?', '
  <h2 style="font-size:22px;font-weight:700;color:#0b0b0b;margin:0 0 16px 0;letter-spacing:-0.3px;">Twoja praktyka, Twoje zasady</h2>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 16px 0;">Wiemy, że prowadzenie praktyki położniczej to nie tylko opieka nad pacjentkami. To też zarządzanie terminami, dokumentacja i pozyskiwanie nowych pacjentek.</p>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 12px 0;"><strong style="color:#e352ad;">MyMidwife</strong> pomoże Ci:</p>
  <table style="margin:0 0 20px 0;width:100%;">
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Automatycznie pozyskiwać pacjentki z Twojej okolicy</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Zarządzać harmonogramem wizyt bez telefonów</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Budować reputację dzięki opiniom pacjentek</td></tr>
  </table>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 24px 0;">Wszystko w jednym miejscu, bez zbędnej biurokracji.</p>
  <p style="color:#989898;font-size:14px;margin:0;">Pozdrawiamy,<br/><strong style="color:#0b0b0b;">Zespół MyMidwife</strong></p>
'),
('midwife', 'day7', 'MyMidwife – dołącz do grona pierwszych położnych!', '
  <h2 style="font-size:22px;font-weight:700;color:#0b0b0b;margin:0 0 16px 0;letter-spacing:-0.3px;">Bądź jedną z pierwszych!</h2>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 16px 0;">Platforma <strong style="color:#e352ad;">MyMidwife</strong> jest już prawie gotowa. Położne, które dołączą jako pierwsze, będą miały:</p>
  <table style="margin:0 0 20px 0;width:100%;">
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Darmowy dostęp w okresie beta</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Wpływ na rozwój funkcji platformy</td></tr>
    <tr><td style="height:6px;"></td></tr>
    <tr><td style="padding:10px 16px;background:#FEFBFD;border-left:3px solid #e352ad;border-radius:4px;color:#414141;font-size:14px;">Priorytetowe wsparcie techniczne</td></tr>
  </table>
  <p style="color:#414141;font-size:15px;line-height:1.7;margin:0 0 24px 0;">Jeśli masz pytania lub pomysły &mdash; odpowiedz na tego maila. Chętnie porozmawiamy!</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="https://mymidwife.pl" style="display:inline-block;background:#e352ad;color:#ffffff;padding:12px 32px;border-radius:11px;text-decoration:none;font-size:14px;font-weight:600;">Odwiedź mymidwife.pl</a>
  </div>
  <p style="color:#989898;font-size:14px;margin:0;">Do zobaczenia wkrótce!<br/><strong style="color:#0b0b0b;">Zespół MyMidwife</strong></p>
');
