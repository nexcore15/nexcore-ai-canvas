/**
 * Deterministic prompt analyser.
 *
 * Reads a natural-language prompt and derives the generation configuration
 * (style, aspect ratio, quality, lighting, camera) using weighted keyword
 * scoring with confidence. The prompt itself is never rewritten here — the
 * result is only used as generation *parameters*.
 */

export type StyleId = "realistic" | "3d" | "2d" | "cartoon";
export type QualityId = "hd" | "ultra";
export type RatioId = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export const RATIO_SIZES: Record<RatioId, { width: number; height: number; label: string }> = {
  "1:1": { width: 1024, height: 1024, label: "1:1 Square" },
  "16:9": { width: 1344, height: 768, label: "16:9 Wide" },
  "9:16": { width: 768, height: 1344, label: "9:16 Vertical" },
  "4:3": { width: 1152, height: 864, label: "4:3 Classic" },
  "3:4": { width: 864, height: 1152, label: "3:4 Portrait" },
};

export const DEFAULT_RATIO: RatioId = "1:1";
export const DEFAULT_STYLE: StyleId = "realistic";

export type Analysis = {
  style: StyleId;
  styleLabel: string;
  styleConfidence: number;
  styleDetected: boolean;
  cinematic: boolean;
  ratio: RatioId;
  ratioDetected: boolean;
  quality: QualityId;
  qualityDetected: boolean;
  lighting: string[];
  camera: string[];
  width: number;
  height: number;
  /** Short informational chips for the UI. */
  chips: string[];
};

type Rule = { re: RegExp; weight: number };

const STYLE_RULES: Record<StyleId, Rule[]> = {
  "3d": [
    { re: /\bpixar[- ]?(quality|style)?\b/, weight: 5 },
    { re: /\b3\s?-?\s?d\b/, weight: 4 },
    { re: /\bthree[- ]dimensional\b/, weight: 3 },
    { re: /\b(octane|blender|unreal engine|redshift|cinema\s?4d|c4d|zbrush)\b/, weight: 4 },
    { re: /\b(cgi|render(ed|ing)?|claymation|clay render|isometric render)\b/, weight: 3 },
    { re: /\b(dreamworks|disney)\s?(style|animation)?\b/, weight: 3 },
    { re: /\bsubsurface scattering|ray[- ]?traced?\b/, weight: 3 },
  ],
  realistic: [
    { re: /\bphoto[- ]?realistic\b/, weight: 5 },
    { re: /\breal(istic|ism)\b/, weight: 4 },
    { re: /\bphotograph(y)?\b/, weight: 4 },
    { re: /\b(dslr|full[- ]frame|bokeh|50mm|35mm|85mm|shot on (a )?(canon|nikon|sony|iphone))\b/, weight: 4 },
    { re: /\b(portrait photo|street photo|documentary|hyper[- ]?real)\b/, weight: 3 },
    { re: /\b(skin texture|natural lighting|film grain)\b/, weight: 2 },
  ],
  "2d": [
    { re: /\b(2\s?-?\s?d)\b/, weight: 4 },
    { re: /\bflat (vector|design|illustration)\b/, weight: 4 },
    { re: /\bvector art\b/, weight: 4 },
    { re: /\b(hand[- ]drawn|line art|lineart|ink drawing|sketch|pencil drawing)\b/, weight: 4 },
    { re: /\b(illustration|illustrated|poster art|storybook|watercolou?r|gouache|matte painting)\b/, weight: 3 },
    { re: /\b(minimalist? (art|poster)|graphic design)\b/, weight: 2 },
  ],
  cartoon: [
    { re: /\bcartoon\b/, weight: 5 },
    { re: /\ban(ime|i-?me)\b/, weight: 5 },
    { re: /\b(manga|chibi|kawaii)\b/, weight: 4 },
    { re: /\b(comic (book )?(style|art)?|caricature|doodle)\b/, weight: 3 },
    { re: /\b(stylised|stylized) character\b/, weight: 3 },
    { re: /\b(studio ghibli|ghibli|looney tunes|simpsons)\b/, weight: 4 },
  ],
};

const STYLE_LABEL: Record<StyleId, string> = {
  realistic: "Photorealistic",
  "3d": "3D Animation",
  "2d": "2D Illustration",
  cartoon: "Cartoon / Anime",
};

const LIGHTING_RULES: [RegExp, string][] = [
  [/\bcinematic light(ing)?\b/, "Cinematic lighting"],
  [/\b(warm )?(morning|sunrise) (sun)?light\b/, "Warm morning sunlight"],
  [/\bgolden hour\b/, "Golden hour"],
  [/\bsunset|dusk\b/, "Sunset light"],
  [/\bstudio light(ing)?\b/, "Studio lighting"],
  [/\bneon( lights?| glow)?\b/, "Neon glow"],
  [/\bbacklit|rim light(ing)?\b/, "Rim light"],
  [/\bsoft light(ing)?|diffused light\b/, "Soft light"],
  [/\bmoonlight|night time|at night\b/, "Night light"],
  [/\bvolumetric (light|fog)\b/, "Volumetric light"],
  [/\bdramatic light(ing)?|chiaroscuro\b/, "Dramatic lighting"],
];

const CAMERA_RULES: [RegExp, string][] = [
  [/\bcinematic (shot|composition|frame)\b/, "Cinematic shot"],
  [/\bclose[- ]?up|macro\b/, "Close-up"],
  [/\bwide[- ]?(shot|angle)\b/, "Wide shot"],
  [/\bportrait (shot|photo|orientation)?\b/, "Portrait framing"],
  [/\b(aerial|drone|bird'?s[- ]eye)( view| shot)?\b/, "Aerial view"],
  [/\blow[- ]angle\b/, "Low angle"],
  [/\btop[- ]down|flat lay\b/, "Top-down"],
  [/\bover[- ]the[- ]shoulder\b/, "Over the shoulder"],
  [/\bfull[- ]body\b/, "Full body"],
  [/\bisometric\b/, "Isometric"],
];

const QUALITY_RULES: Rule[] = [
  { re: /\bultra[- ]?(detailed|realistic|hd|high)\b/, weight: 3 },
  { re: /\b(8k|4k)\b/, weight: 3 },
  { re: /\bhighly detailed|hyper[- ]?detailed|intricate detail\b/, weight: 3 },
  { re: /\bmasterpiece|award[- ]winning|best quality\b/, weight: 2 },
  { re: /\bphoto[- ]?realistic\b/, weight: 2 },
  { re: /\bcinematic\b/, weight: 1 },
  { re: /\bhigh quality|high[- ]res(olution)?\b/, weight: 1 },
];

function detectRatio(t: string): RatioId | null {
  if (/\b9\s?[:x/]\s?16\b/.test(t)) return "9:16";
  if (/\b16\s?[:x/]\s?9\b/.test(t)) return "16:9";
  if (/\b4\s?[:x/]\s?3\b/.test(t)) return "4:3";
  if (/\b3\s?[:x/]\s?4\b/.test(t)) return "3:4";
  if (/\b1\s?[:x/]\s?1\b|\bsquare\b/.test(t)) return "1:1";
  if (/\b(vertical|portrait orientation|reels?|tiktok|shorts?|story|phone wallpaper|mobile wallpaper)\b/.test(t))
    return "9:16";
  if (/\b(horizontal|widescreen|wide shot|landscape orientation|banner|desktop wallpaper|cinemascope)\b/.test(t))
    return "16:9";
  return null;
}

export function analyzePrompt(raw: string): Analysis {
  const t = ` ${raw.toLowerCase()} `;

  const scores: Record<StyleId, number> = { realistic: 0, "3d": 0, "2d": 0, cartoon: 0 };
  (Object.keys(STYLE_RULES) as StyleId[]).forEach((id) => {
    for (const rule of STYLE_RULES[id]) if (rule.re.test(t)) scores[id] += rule.weight;
  });

  // "3D animation" reads as animated film -> nudge cartoon a little too.
  if (/\b3\s?-?\s?d (animation|animated|cartoon)\b/.test(t)) scores.cartoon += 2;

  const ranked = (Object.keys(scores) as StyleId[]).sort((a, b) => scores[b]! - scores[a]!);
  const top = ranked[0]!;
  const topScore = scores[top]!;
  const styleDetected = topScore >= 3;
  const style: StyleId = styleDetected ? top : DEFAULT_STYLE;
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const styleConfidence = styleDetected ? Math.min(1, (topScore / total) * (topScore / 5)) : 0;

  const detectedRatio = detectRatio(t);
  const ratio = detectedRatio ?? DEFAULT_RATIO;

  const qualityScore = QUALITY_RULES.reduce((sum, r) => (r.re.test(t) ? sum + r.weight : sum), 0);
  const qualityDetected = qualityScore >= 3;
  const quality: QualityId = qualityDetected ? "ultra" : "hd";

  const lighting = LIGHTING_RULES.filter(([re]) => re.test(t)).map(([, l]) => l).slice(0, 3);
  const camera = CAMERA_RULES.filter(([re]) => re.test(t)).map(([, l]) => l).slice(0, 3);
  const cinematic = /\bcinematic\b/.test(t);

  const size = RATIO_SIZES[ratio];

  const chips = [
    STYLE_LABEL[style],
    size.label,
    quality === "ultra" ? "Ultra detail" : "HD quality",
    ...lighting,
    ...camera,
  ].slice(0, 6);

  return {
    style,
    styleLabel: STYLE_LABEL[style],
    styleConfidence: Number(styleConfidence.toFixed(2)),
    styleDetected,
    cinematic,
    ratio,
    ratioDetected: detectedRatio !== null,
    quality,
    qualityDetected,
    lighting,
    camera,
    width: size.width,
    height: size.height,
    chips,
  };
}
