/** Curated prompt library shown under the generator and on the home page. */
export type PromptCategory =
  | "Portrait"
  | "Landscape"
  | "Fantasy"
  | "Abstract"
  | "3D"
  | "Anime";

export const promptCategories: PromptCategory[] = [
  "Portrait",
  "Landscape",
  "Fantasy",
  "Abstract",
  "3D",
  "Anime",
];

export const promptLibrary: { category: PromptCategory; text: string }[] = [
  { category: "Portrait", text: "Studio portrait of a young woman, soft rim light, 85mm lens, film grain" },
  { category: "Portrait", text: "Elderly fisherman with weathered face, golden hour, ultra detailed skin texture" },
  { category: "Portrait", text: "Cyberpunk street portrait, neon reflections on wet skin, shallow depth of field" },
  { category: "Portrait", text: "Black and white editorial headshot, dramatic single key light" },
  { category: "Portrait", text: "Smiling child holding a paper plane, warm natural window light" },
  { category: "Portrait", text: "Astronaut removing helmet, reflection of a nebula in the visor" },
  { category: "Portrait", text: "Ballet dancer mid-turn, flowing fabric frozen in motion, studio backdrop" },
  { category: "Portrait", text: "Fashion portrait with holographic makeup, cyan and violet gel lighting" },
  { category: "Landscape", text: "A futuristic city at sunset, glass towers, flying transports, cinematic haze" },
  { category: "Landscape", text: "Misty pine forest at dawn, volumetric light rays, ultra realistic" },
  { category: "Landscape", text: "Iceland black sand beach with basalt columns, long exposure waves" },
  { category: "Landscape", text: "Terraced rice fields in the rain, soft pastel palette, drone view" },
  { category: "Landscape", text: "Desert canyon under the Milky Way, star trails, 30 second exposure" },
  { category: "Landscape", text: "Alpine lake mirror reflection, snow peaks, crisp morning air" },
  { category: "Landscape", text: "Tokyo alley at night in the rain, neon signs, puddle reflections" },
  { category: "Landscape", text: "Floating islands above a cloud sea, waterfalls falling into the void" },
  { category: "Fantasy", text: "Ancient library inside a hollow tree, glowing books, warm lantern light" },
  { category: "Fantasy", text: "Ice dragon perched on a frozen cathedral, aurora sky" },
  { category: "Fantasy", text: "A cute cat astronaut floating near Saturn, whimsical storybook style" },
  { category: "Fantasy", text: "Elven archer in an enchanted forest, bioluminescent plants" },
  { category: "Fantasy", text: "Steampunk airship docking at a mountain port, brass and copper detail" },
  { category: "Fantasy", text: "Underwater ruins of a lost city, shafts of sunlight, schools of fish" },
  { category: "Fantasy", text: "Wizard's alchemy desk, floating runes, potion glow, cozy clutter" },
  { category: "Fantasy", text: "Samurai standing in a field of glowing red maple leaves" },
  { category: "Abstract", text: "Abstract digital art, liquid chrome ribbons, violet and cyan gradient" },
  { category: "Abstract", text: "Generative fractal bloom, iridescent, black background, high contrast" },
  { category: "Abstract", text: "Minimal bauhaus poster shapes, muted pastel palette, grain texture" },
  { category: "Abstract", text: "Macro photo of oil and ink swirling in water, neon backlight" },
  { category: "Abstract", text: "Wireframe topography waves, synthwave grid, glowing horizon" },
  { category: "Abstract", text: "Paper cut layered mountains, soft shadows, pastel gradient sky" },
  { category: "Abstract", text: "Smoke sculpture forming a human face, monochrome studio light" },
  { category: "Abstract", text: "Kaleidoscopic stained glass mandala, jewel tones, symmetrical" },
  { category: "3D", text: "Isometric 3D bedroom diorama, clay render, soft global illumination" },
  { category: "3D", text: "Glossy 3D robot mascot, pastel studio, octane render, product shot" },
  { category: "3D", text: "Low poly island with a lighthouse, stylized water, warm sunset" },
  { category: "3D", text: "3D typography made of melting glass, caustics, dark backdrop" },
  { category: "3D", text: "Miniature floating coffee shop, cutaway view, cozy interior" },
  { category: "3D", text: "Inflatable balloon sneaker, chrome laces, seamless violet background" },
  { category: "3D", text: "Voxel art castle on a hill, day cycle lighting, playful colors" },
  { category: "3D", text: "Photoreal product render of a perfume bottle, water splash, softbox" },
  { category: "Anime", text: "Anime girl on a rooftop at dusk, city lights bokeh, cel shaded" },
  { category: "Anime", text: "Shonen hero mid power-up, speed lines, dramatic sky" },
  { category: "Anime", text: "Ghibli style countryside cottage, sunflowers, warm summer breeze" },
  { category: "Anime", text: "Mecha pilot cockpit interior, holographic HUD, dramatic lighting" },
  { category: "Anime", text: "Chibi barista cat serving latte art, pastel cafe" },
  { category: "Anime", text: "Retro 90s anime still, VHS grain, city pop aesthetic" },
  { category: "Anime", text: "Magical girl transformation, sparkles, ribbon swirl, vivid colors" },
  { category: "Anime", text: "Ninja running across rooftops under a full moon, ink wash style" },
  { category: "Anime", text: "School festival evening, lanterns, fireworks in the sky" },
  { category: "Anime", text: "Sleepy dragon curled around a hot spring, soft watercolor style" },
];

export const quickPrompts = [
  "A futuristic city at sunset",
  "A cute cat astronaut",
  "Abstract digital art",
  "Golden hour portrait photo",
  "Cozy cabin in the snow",
];