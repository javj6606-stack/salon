# Glowly SaaS — Next.js + Supabase

Lovable se migrate ki gayi Glowly landing page, ab full Next.js project ke andar, multi-tenant Supabase backend ke saath.

## Setup steps

1. **Dependencies install karo**
   ```
   npm install
   ```

2. **Supabase project banao** (agar Prophecy AI se alag chahti ho — recommended, taake dono products ka billing/data separate rahe)
   - https://supabase.com pe naya project banao
   - Project Settings > API se URL aur anon key copy karo

3. **`.env.local` banao** `.env.local.example` ko copy karke, aur apni Supabase + Wati.io + Groq keys daalo

4. **Database schema apply karo**
   - Supabase dashboard > SQL Editor > `supabase/schema.sql` ka poora content paste karke run karo
   - Yeh multi-tenant tables banayega: salons, salon_members, whatsapp_credentials, services, staff, clients, bookings, conversations, messages — sab RLS-enabled

5. **Local run karo**
   ```
   npm run dev
   ```
   http://localhost:3000 pe landing page dikhni chahiye

6. **Deploy** — Vercel pe free tier se deploy kar sakti ho (GitHub repo connect karke), Lovable jaisa credit-based system nahi hoga.

## Multi-tenant model

- Ek `salons` row = ek client salon (tenant)
- `salon_members` table auth user ko salon se link karti hai (owner/staff role)
- Har baaki table (`clients`, `bookings`, `conversations` waghera) `salon_id` se scoped hai
- RLS policies automatically ensure karti hain ke ek salon ka data doosre salon ko kabhi dikhe nahi

## Next steps (hum saath mein karenge)

- [ ] `/auth` signup/login pages (Supabase Auth)
- [ ] Salon onboarding flow (naya salon create karna, services/staff add karna)
- [ ] Dashboard (bookings calendar, CRM, WhatsApp inbox UI)
- [ ] Wati.io webhook route (`/api/webhooks/wati`) — incoming WhatsApp messages receive karna
- [ ] AI receptionist logic (Groq/DeepSeek se reply generate karna, booking state machine)
- [ ] Billing (EasyPaisa/JazzCash manual ya automated)
