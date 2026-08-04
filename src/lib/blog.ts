/** Static, SEO-optimised blog content for Pixflow AI. */
export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  readingTime: string;
  author: string;
  /** Lines starting with "## " render as an H2, everything else as a paragraph. */
  body: string[];
};

export const author = {
  name: "Nexcore Studio",
  role: "The team behind Pixflow AI",
  bio: "Nexcore is a small product studio building fast, friendly AI tools that anyone can use without a tutorial.",
};

export const posts: Post[] = [
  {
    slug: "how-to-write-perfect-ai-image-prompts",
    title: "How to Write Perfect AI Image Prompts",
    description:
      "A simple five-part formula for writing AI image prompts that produce sharp, intentional results on the first try.",
    category: "Prompting",
    tags: ["prompts", "beginner", "guide"],
    date: "2026-01-12",
    readingTime: "6 min read",
    author: author.name,
    body: [
      "Most disappointing AI images are not a model problem. They are a description problem. A model can only draw what you actually described, so the fastest way to better output is a better sentence.",
      "## The five-part formula",
      "Write your prompt in this order: subject, action or pose, setting, lighting, and style or medium. For example: 'a grey tabby cat, curled asleep, on a windowsill in a wooden cabin, warm afternoon light, 35mm film photograph'. Each part removes a decision the model would otherwise make randomly.",
      "## Be concrete, not poetic",
      "'Beautiful' and 'amazing' tell the model nothing. 'Golden hour backlight', 'shallow depth of field', and 'soft rim light' tell it a lot. Swap every adjective that describes your feelings for one that describes what a camera would see.",
      "## Control the camera",
      "Photography words are powerful because training data is full of them. Try 'wide angle', '85mm portrait lens', 'macro', 'drone shot from above', or 'low angle'. One camera word often changes a picture more than ten style words.",
      "## Add a style anchor",
      "Anchor the look with a medium: oil painting, watercolour, 3D clay render, cel-shaded anime, isometric illustration, studio product photo. Mixing three styles usually produces mush; pick one and commit.",
      "## Iterate one variable at a time",
      "When something is close but not right, change a single element and regenerate. Changing five things at once means you never learn which word did the work. Keep the prompts that work in a personal library and reuse them as templates.",
      "## A quick checklist",
      "Before you hit Generate, ask: is the subject specific, is the setting named, did I state the lighting, did I pick one medium, and did I remove anything I do not want using a negative prompt? Five yeses usually means a good image.",
    ],
  },
  {
    slug: "top-free-ai-image-generators-2026",
    title: "Top 10 Free AI Image Generators in 2026",
    description:
      "An honest look at the best genuinely free AI image generators in 2026, what each one is good at, and where the limits hide.",
    category: "Tools",
    tags: ["tools", "free", "comparison"],
    date: "2026-01-20",
    readingTime: "7 min read",
    author: author.name,
    body: [
      "'Free' means different things across AI image tools. Some are free forever with light limits, some give a trial of credits, and some are free only until you want a resolution you can actually use. Here is how to read the landscape in 2026.",
      "## Free forever, no account",
      "Open community endpoints are the only truly no-strings option. They need no sign-up and no key, which is exactly why Pixflow AI uses one as its default engine. Quality is strong for illustration and concept work, and generation is fast.",
      "## Free tiers with a daily allowance",
      "Most hosted models give a daily quota measured in requests or compute units. These are excellent for photoreal work and prompt understanding, but you will hit a ceiling on a busy day, so treat them as your quality option rather than your default.",
      "## Free trials disguised as free plans",
      "If a tool asks for a card before your first image, it is a trial. There is nothing wrong with that, but plan around the day the credits stop.",
      "## What actually matters when choosing",
      "Speed to first image, whether commercial use is allowed, output resolution, whether a watermark is added, and how well the model follows a long prompt. Resolution and watermarks are where free plans most often disappoint.",
      "## Our recommendation",
      "Use a free forever engine for exploring ideas quickly, then re-render your two or three favourites on a higher quality model. That workflow keeps you inside every free tier and still gives you images worth publishing.",
    ],
  },
  {
    slug: "understanding-aspect-ratios-in-ai-art",
    title: "Understanding Aspect Ratios in AI Art",
    description:
      "Which aspect ratio to choose for portraits, wallpapers, thumbnails and social posts, and why the ratio changes composition.",
    category: "Basics",
    tags: ["aspect ratio", "composition", "basics"],
    date: "2026-01-28",
    readingTime: "5 min read",
    author: author.name,
    body: [
      "Aspect ratio is not just a crop. Models compose differently depending on the canvas shape, so the same prompt can produce a close-up in 1:1 and a sweeping vista in 16:9.",
      "## 1:1 square",
      "The safest default. Great for avatars, album art, product shots and anything destined for a feed. Square framing pushes the model toward a single centred subject.",
      "## 16:9 widescreen",
      "Landscapes, cinematic scenes, desktop wallpapers, blog headers and video thumbnails. Wide canvases invite background detail, so name the environment in your prompt or the model will invent one.",
      "## 9:16 vertical",
      "Phone wallpapers, stories and short-form video covers. Vertical framing suits full-body characters and tall architecture. Add 'full body' or 'from head to toe' so the subject is not cropped.",
      "## 4:3 and 3:4",
      "The classic photo shapes. 4:3 feels documentary; 3:4 is the standard portrait crop and is often the best choice for people. If a face is your subject, 3:4 usually beats 1:1.",
      "## A practical tip",
      "Generate at the ratio you will publish at. Cropping a square down to 16:9 throws away pixels and often cuts the part of the composition the model cared about most.",
    ],
  },
  {
    slug: "beginners-guide-to-text-to-image-ai",
    title: "Beginner's Guide to Text-to-Image AI",
    description:
      "What text-to-image AI actually does, how to make your very first image, and the three mistakes every beginner makes.",
    category: "Basics",
    tags: ["beginner", "guide", "basics"],
    date: "2026-02-04",
    readingTime: "6 min read",
    author: author.name,
    body: [
      "Text-to-image models learned from millions of image and caption pairs. When you type a description, the model starts from visual noise and gradually removes it until the picture matches your words. You do not need to understand the maths to get great results.",
      "## Your first image in one minute",
      "Type a plain sentence describing what you want to see, pick a shape, and press Generate. Do not overthink the first attempt. Seeing what the model gives you back is the fastest way to learn what to add.",
      "## Mistake one: writing a title, not a description",
      "'Cool dragon' is a title. 'An ice dragon perched on a frozen cathedral under an aurora sky' is a description. Descriptions win every time.",
      "## Mistake two: expecting readable text",
      "Image models still struggle with long words inside pictures. Add text afterwards in any design tool rather than fighting the model for it.",
      "## Mistake three: giving up after one try",
      "Every image is a roll of the dice with a different seed. Generate three or four, keep the closest, and refine from there.",
      "## Where to go next",
      "Once your images look right, learn negative prompts to remove unwanted elements, and start collecting the phrases that consistently work for you.",
    ],
  },
  {
    slug: "best-prompts-for-realistic-portraits",
    title: "Best Prompts for Realistic Portraits",
    description:
      "Copy-ready portrait prompts plus the lighting and lens vocabulary that makes AI faces look like real photographs.",
    category: "Prompting",
    tags: ["portrait", "prompts", "photography"],
    date: "2026-02-11",
    readingTime: "6 min read",
    author: author.name,
    body: [
      "Realistic portraits come from photography vocabulary. If your prompt reads like a lighting plan, the output starts to look like a photograph instead of a painting.",
      "## The lens matters",
      "'85mm portrait lens, f/1.8, shallow depth of field' gives you the compressed, softly blurred background that people read as professional. A 35mm lens feels more documentary and shows more room.",
      "## Name the light",
      "Try 'soft window light', 'golden hour backlight', 'single key light with a dark background', or 'overcast diffused daylight'. Each produces a completely different mood from the same subject.",
      "## Add skin realism",
      "Words like 'natural skin texture', 'visible pores', 'subtle skin imperfections' and 'film grain' fight the plastic look that models drift toward.",
      "## Three prompts to copy",
      "1. 'Studio portrait of a woman in her thirties, soft rim light, dark grey backdrop, 85mm lens, natural skin texture, sharp eyes'. 2. 'Elderly fisherman with a weathered face, golden hour, coastal village background, documentary photograph'. 3. 'Editorial black and white headshot, dramatic single key light, high contrast, medium format film'.",
      "## Clean it up with negatives",
      "Add a negative prompt such as 'plastic skin, extra fingers, distorted face, watermark, text' to remove the most common artefacts.",
    ],
  },
  {
    slug: "ai-art-copyright-what-you-need-to-know",
    title: "AI Art Copyright: What You Need to Know",
    description:
      "A plain-English overview of ownership, commercial use and attribution for AI generated images. Not legal advice.",
    category: "Legal",
    tags: ["copyright", "commercial use", "legal"],
    date: "2026-02-18",
    readingTime: "5 min read",
    author: author.name,
    body: [
      "This article is general information written for creators, not legal advice. Rules differ by country and continue to change, so check your local position before making commercial commitments.",
      "## Who owns an AI image?",
      "In several jurisdictions, purely machine-generated output cannot be registered for copyright because there is no human author. Meaningful human creative input, such as substantial editing or composition, strengthens any claim.",
      "## Can you use AI images commercially?",
      "Usually yes, subject to the terms of the tool you used. Always read the specific service terms rather than assuming, especially for logos, merchandise and paid advertising.",
      "## Risky prompts",
      "Naming a living artist, a brand, a trademarked character or a recognisable person invites problems regardless of what the generator allows. Describe a style instead of borrowing a name.",
      "## Be transparent",
      "Labelling images as AI generated is increasingly expected and is required by some platforms. It costs nothing and builds trust with your audience.",
      "## Keep records",
      "Save your prompts, settings and dates. If ownership is ever questioned, a documented creative process is your best evidence.",
    ],
  },
  {
    slug: "how-to-use-negative-prompts-effectively",
    title: "How to Use Negative Prompts Effectively",
    description:
      "Negative prompts remove artefacts and clutter. Here is what to put in them, what to leave out, and how long they should be.",
    category: "Prompting",
    tags: ["negative prompt", "quality", "prompts"],
    date: "2026-02-25",
    readingTime: "4 min read",
    author: author.name,
    body: [
      "A negative prompt lists what you do not want to see. Used well it is the cheapest quality upgrade available; used carelessly it quietly strips detail out of your image.",
      "## A solid default",
      "'blurry, low quality, distorted hands, extra limbs, watermark, text, jpeg artifacts' covers the majority of common failures without touching your subject.",
      "## Fix problems you can actually see",
      "Do not paste a hundred-word negative prompt you found online. Generate first, look at what went wrong, then add that specific thing. Short, targeted negatives outperform long generic ones.",
      "## Remove clutter, not content",
      "Negatives are great for tidying backgrounds: 'crowd, cars, signage, clutter'. But negating something closely tied to your subject can also delete the subject.",
      "## Watch for over-negation",
      "If images start looking flat or empty, your negative prompt is too aggressive. Cut it in half and compare.",
      "## Save your best one",
      "Once you find a negative prompt that works for your style, reuse it everywhere. Consistency there makes it easier to judge changes in your positive prompt.",
    ],
  },
  {
    slug: "creating-consistent-characters-with-ai",
    title: "Creating Consistent Characters with AI",
    description:
      "Techniques for keeping the same character recognisable across many AI generated images, from seed locking to character sheets.",
    category: "Workflow",
    tags: ["characters", "workflow", "advanced"],
    date: "2026-03-04",
    readingTime: "6 min read",
    author: author.name,
    body: [
      "Consistency is the hardest part of AI illustration. Models do not remember your character between generations, so you have to encode that memory into every prompt.",
      "## Write a character bible",
      "Fix the details in words and never change them: age, hair colour and cut, eye colour, skin tone, one distinctive feature, and a signature outfit. Paste the same block into every prompt.",
      "## Lock the seed",
      "The seed controls the random starting point. Reusing a seed with a similar prompt keeps faces and proportions much closer together. Change the seed only when you want a genuinely new look.",
      "## Change one thing at a time",
      "Keep the character block identical and vary only the scene sentence. If you rewrite everything, you get a new person.",
      "## Build a character sheet first",
      "Generate a front, side and three-quarter view in one image, pick the version you like, and use it as your visual reference for all later prompts.",
      "## Accept small drift",
      "Perfect consistency is not realistic yet. Aim for recognisable rather than identical, and keep the strongest images as your canonical set.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const categories = Array.from(new Set(posts.map((p) => p.category)));