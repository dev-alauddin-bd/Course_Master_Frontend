I will update your README.md to reflect the switch to pnpm, Intlayer, and OpenRouter. This will make your documentation look professional and up-to-date with your current tech stack.
## Updated README.md (Additions highlighted)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://shields.io" />
  <img src="https://shields.io" />
  <img src="https://shields.io" /></p>
# 🎓 CourseMaster — Frontend> A stunning, production-grade online learning platform UI — built with **Next.js 16**, **React 19**, and **AI-powered Internationalization**.
---## ✨ Features

| Feature | Description |
|---|---|
| 🌐 **AI i18n** | Automated translations using **Intlayer** + **OpenRouter (Llama 3.3)** |
| 🌍 **Multi-Language** | Native support for **English, Bengali, Arabic (RTL), French, and Spanish** |
| 🏠 **Landing Page** | Hero section, featured courses, testimonials, trust bar |
| 💳 **Stripe Checkout** | Seamless payment flow for paid courses |
| 📱 **Fully Responsive** | Mobile-first, including **RTL layout support** for Arabic |
---## ⚡ Quick Start### Prerequisites- Node.js v20+- **pnpm** (Preferred package manager)
### 1. Clone & Install```bash
git clone <repo-url>
cd courseMaster-frontend
pnpm install

## 2. Environment Variables
Create a .env file:

NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
OPENROUTER_API_KEY=your_openrouter_key_here

## 3. Internationalization (AI Translation)
Generate or update translations using Intlayer:

# Fill missing translations using OpenRouter AI
npx intlayer fill
# Build JSON dictionaries
npx intlayer build

## 4. Run Development Server

pnpm dev

------------------------------
## 🧪 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework (App Router) |
| Intlayer 8.6 | AI-Driven Content Management |
| OpenRouter | AI Provider (Llama 3.3 70B) |
| pnpm | Fast, disk space efficient package manager |
| i18next | Client-side Internationalization |
| Tailwind CSS 4 | Utility-first styling |

------------------------------
## 📱 Multi-Language Support (i18n)
This project uses a hybrid approach for translations:

   1. Intlayer: Manages content dictionaries and uses OpenRouter AI to automatically translate strings into 5 languages.
   2. i18next: Handles client-side switching and persistence.
   3. RTL Support: Automatic layout flipping for Arabic using dir="rtl".

------------------------------

Built with ❤️ and AI for CourseMaster


### What changed?
1. **Badges:** Added **pnpm**, **Intlayer**, and **OpenRouter** badges.
2. **Commands:** Changed `npm install` and `npm run dev` to **`pnpm install`** and **`pnpm dev`**.
3. **AI Section:** Added a specific section for **Intlayer** commands (`fill` and `build`).
4. **Environment:** Added the **`OPENROUTER_API_KEY`** to the environment variable list.
5. **Languages:** Mentioned the new **Bengali** and **Arabic (RTL)** support.

Your documentation now perfectly matches your code! Ready to push?


