# Fix: prompt accuracy + premium background

Do cheezein theek karni hain — (1) jaisi photo maangi jaaye waisi hi bane, (2) website ka background premium lage.

## 1. Prompt ke hisaab se image na banna

Abhi jo ho raha hai:
- Smart pipeline fail hone par app seedha Pollinations par chala jaata hai aur wahan **raw text** bhejta hai — Gemini ka detailed prompt use hi nahi hota, isliye subject/detail miss ho jaate hain.
- Aspect ratio sirf prompt ke text mein "9:16" likh kar bataya jaata hai, request mein enforce nahi hota — vertical maangne par square aa jaata hai.
- Gemini ka rewrite 45-80 words tak cap hai, to lambe prompts (jaise "Sabzi Nagar" wale 3 characters, alag-alag kapde) mein details kat jaati hain.

Fix:
- Fallback ko bhi **optimized prompt** dena, raw text nahi. Server pehle prompt optimize kar ke wapas bhejega, client fallback usi ko encode karega.
- Prompt optimizer ko "fidelity-first" banana: har subject, count, colour, kapda, naam ko literally preserve karna, word cap 60-140 tak badhana, aur character-by-character description ko structure dena.
- Aspect ratio proper enforce karna: image request mein width/height + aspect ratio dono bhejna (Gemini image call mein `imageConfig.aspectRatio`, Pollinations mein sahi width/height), aur ratio ko prompt mein sirf hint ki tarah rakhna.
- Style aur ratio ko fallback URL mein bhi apply karna, plus `model=flux` + `enhance=false` taaki optimized prompt dobara na badla jaaye.
- Agar prompt bahut lamba ho to trim karne ki jagah important entities ko aage rakhna.

## 2. Website background / theme

Naya premium dark background:
- Base: deep midnight indigo (`oklch(0.12 0.03 275)`) — abhi se thoda deeper aur cleaner.
- Do soft aurora orbs (violet + cyan) jo bahut dheere move karein, blur zyada, opacity kam — abhi wale harsh blobs hata kar.
- Halka radial vignette + fine noise overlay taaki flat na lage.
- Ek subtle grid/mesh line layer 4% opacity par, sirf hero ke peeche.
- Cards ka glass thoda aur transparent + border highlight, taaki background dikhe aur depth aaye.
- Light mode bhi साथ mein tune karna (soft off-white, same accent).

Sab kuch `src/styles.css` ke tokens/utilities mein hoga — koi hardcoded colour components mein nahi.

## Verification

- Aapke "Sabzi Nagar" wale exact prompt se 9:16 image generate karke check karunga ki teeno characters aur unke kapdon ke colours sahi aaye.
- Square + wide ratio bhi test.
- Homepage ka screenshot le kar naya background confirm karunga.

## Technical notes

Files: `src/lib/ai-engine.server.ts` (optimizer rules + aspect ratio config + fallback prompt return), `src/routes/api/generate-image.ts` (optimized prompt response par bhi jab render fail ho), `src/components/site/generator.tsx` (fallback URL optimized prompt + ratio se banaye), `src/styles.css` (background tokens, aurora, noise, grid).
