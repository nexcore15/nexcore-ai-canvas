# Nexcore AI Canvas

Build a fully free AI Image Generation web app called "pixflow ai " with a modern, clean dark theme (slate-900 background with gradient accents in purple and cyan). The app must be extremely easy to use — anyone from a 10-year-old to a 70-year-old should be able to generate images without any tutorial.

CORE FEATURES:

1. Text-to-Image Generation: A big, centered text input box with placeholder "Describe your dream image..." and a prominent "Generate" button. Support multiple aspect ratios: 1:1, 16:9, 9:16, 4:3, 3:4.

2. Multiple Free AI Models: Integrate these free image generation APIs through a secure backend proxy — NEVER expose API keys in frontend:

   - Nano Banana API (Gemini-based, ~500 free requests/day)

   - Cloudflare Workers AI (10,000 neurons/day free)

   - Pollinations AI (completely free, no API key needed)

   - Picsart API (free tier available)

   Use a dropdown so users can pick which model to use. Default to Pollinations AI as it requires no key.

3. API KEY SECURITY (CRITICAL): Store ALL API keys in Supabase Edge Functions environment variables. Create Supabase Edge Functions that act as a proxy — frontend calls the Edge Function, Edge Function calls the external API with the secret key, and returns only the image URL/base64 to frontend. Frontend code should NEVER contain any API keys.

4. Image Gallery: Show previously generated images in a masonry grid layout. Each image card should have: download button, share button, copy prompt button, and "Generate Similar" button.

5. Prompt Enhancer: Add a "Enhance Prompt" button that uses a free LLM API (like Gemini Flash via Nano Banana or Cloudflare AI) to improve user's basic prompt into a detailed, professional prompt before generating the image.

6. Negative Prompt Support: Allow users to specify what they DON'T want in the image.

7. History & Favorites: Users can save favorite images. Use Supabase auth and database to store user history.

8. Download Options: Download in PNG, JPG, and WebP formats.

9. SEO-Friendly Structure:

   - Proper meta tags, Open Graph tags, Twitter Card tags for every page

   - Semantic HTML (header, main, section, article tags)

   - Alt text for all images

   - Fast loading with lazy loading for gallery images

   - Proper heading hierarchy (H1, H2, H3)

   - JSON-LD schema markup for WebApplication

10. Complete Pages for AdSense Approval:

    - Home (the tool + featured gallery)

    - Blog (with 5+ pre-written articles about AI image generation, prompts, tips)

    - About Us (with team info, mission)

    - Contact Us (with working contact form using Supabase)

    - Privacy Policy (GDPR compliant template)

    - Terms of Service

    - Disclaimer

    - FAQ Page

11. Blog System: A functional blog with categories, tags, author pages, and SEO-optimized articles. Each article should have social share buttons.

12. User Authentication: Sign up/login with email, Google OAuth. Free users get 20 daily credits. Display remaining credits.

13. Credit System: Track credits in Supabase. Each image generation costs 1 credit. Free users get 20/day. Show a "Get More Credits" button (for future monetization).

14. UI/UX Details:

    - Smooth animations using Framer Motion

    - Loading skeletons while generating

    - Progress indicator during generation

    - Toast notifications for success/error

    - Responsive design — perfect on mobile, tablet, desktop

    - Dark/Light mode toggle

    - Sticky header with navigation

    - Footer with quick links and social icons

15. Performance: Image optimization, lazy loading, code splitting. Core Web Vitals should be green.

16. Analytics: Integrate Google Analytics 4 script placeholder.

TECH STACK: React + TypeScript + Tailwind CSS + Supabase (Auth, Database, Storage, Edge Functions) + Framer Motion + React Router.

Make sure the entire codebase is production-ready, well-commented, and follows best practices. The app should look premium and professional, not like a side project.

Create a production-ready AI Image Generator web app named "FreeImageAI" with an elegant, minimalist design using a deep navy-to-purple gradient theme. The app should feel like a premium paid tool but be completely free to use.

MUST-HAVE FEATURES:

1. One-Click Image Generation: Large hero section with a text input and "Generate" button. Below the input, show quick prompt suggestions like "A futuristic city at sunset", "A cute cat astronaut", "Abstract digital art".

2. Free API Integration with Secure Key Handling:

   - Primary: Pollinations AI (truly free, no API key, no rate limit issues)

   - Secondary: Nano Banana API (Gemini Flash Image, ~500/day free)

   - Tertiary: Cloudflare Workers AI (10,000 neurons/day free)

   - Store Nano Banana and Cloudflare API keys ONLY in Supabase Edge Functions secrets. Create a /generate-image Edge Function that receives {prompt, model, width, height} from frontend, adds the secret API key server-side, calls the external API, and returns {imageUrl, modelUsed}. Frontend must NEVER see any API keys.

3. Model Selector: Dropdown to choose between "Pollinations (Free Forever)", "Nano Banana (High Quality)", "Cloudflare AI (Fast)". Auto-fallback to Pollinations if others fail.

4. Gallery Wall: Masonry layout showing all generated images. Infinite scroll. Each image has: full-screen view, download (PNG/JPG), copy prompt, regenerate.

5. Prompt Library: Curated collection of 50+ trending prompts organized by categories (Portrait, Landscape, Fantasy, Abstract, 3D, Anime). Clicking a prompt auto-fills the input.

6. SEO-Optimized Blog: Built-in blog with 8 pre-written articles:

   - "How to Write Perfect AI Image Prompts"

   - "Top 10 Free AI Image Generators in 2026"

   - "Understanding Aspect Ratios in AI Art"

   - "Beginner's Guide to Text-to-Image AI"

   - "Best Prompts for Realistic Portraits"

   - "AI Art Copyright: What You Need to Know"

   - "How to Use Negative Prompts Effectively"

   - "Creating Consistent Characters with AI"

   Each article should have proper meta description, keywords, schema markup, and social sharing.

7. AdSense-Ready Pages:

   - About (founder story, why we built this)

   - Contact (form + email + social links)

   - Privacy Policy (comprehensive, GDPR-ready)

   - Terms of Service

   - Cookie Policy

   - FAQ (20+ questions about the tool)

8. Auth & Credits: Simple email magic-link auth via Supabase. Users get 25 free generations per day. Show credit counter in header. No auth required for first 3 generations (guest mode).

9. Mobile-First Design: Thumb-friendly buttons, bottom sheet for settings on mobile, swipe gestures in gallery.

10. SEO Technical Setup:

    - Sitemap.xml auto-generated

    - Robots.txt configured

    - Canonical URLs

    - Structured data (FAQPage, SoftwareApplication, Article schemas)

    - Fast page speed (< 2s load time)

    - Mobile-responsive 100/100 score

DESIGN SYSTEM:

- Font: Inter or Geist

- Colors: Slate-950 background, violet-500 primary, cyan-400 accent

- Cards: Rounded-2xl with subtle border and shadow

- Buttons: Gradient backgrounds with hover lift effect

- Inputs: Soft glow on focus

- Loading: Animated shimmer skeletons

Make it feel like a $10,000 product built by a team of 10 developers. Clean code, zero console errors, fully accessible (ARIA labels, keyboard navigation, screen reader support).              starting animation aach rahkna genz look se mai easy to usa hona chahiye + fast kam hona chahiye        prompt khud inhans hona chahiye  abhi jitne bhi ai hai un sab se aach hona chahiye mare compny ka naam hai nexcore aur animation kami nhi honi chahiye seo bhi kar dena fully har ek ek cheez aach ser cheak karna aur sar a kam test kar lena .

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/87a4c45e-e334-4894-985b-6e1952f5f7e2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
