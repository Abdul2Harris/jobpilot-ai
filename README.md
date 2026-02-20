## Project Overview
  - AI-powered job automation platform that scrapes jobs, stores them, matches resumes using embeddings, and notifies users.

## Tech Stack
- **n8n** (workflow automation)
- **Apify** (job scraping)
- **Supabase** (Postgres DB + Auth)
- **Next.js** (Frontend)
- **Node.js / Express** (API layer)
- **OpenAI / Gemini** (AI matching)
- **Docker** (deployment)

## Architecture Flow
= Apify → n8n → Supabase → Backend API → Frontend → AI Matching → Notifications
