import { motion } from "framer-motion";
import { Copy, Download, Heart, RefreshCw, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { downloadImage, slugifyPrompt, type GeneratedImage } from "@/lib/gallery";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  image: GeneratedImage;
  onRegenerate?: (image: GeneratedImage) => void;
  onToggleFavorite?: (id: string) => void;
  onRemove?: (id: string) => void;
};

export function ImageCard({ image, onRegenerate, onToggleFavorite, onRemove }: Props) {
  const save = async (format: "png" | "jpg" | "webp") => {
    try {
      await downloadImage(image.url, format, slugifyPrompt(image.prompt));
      toast.success(`Saved as ${format.toUpperCase()}`);
    } catch {
      toast.error("Download failed. Try opening the image and saving it manually.");
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Made with Pixflow AI", text: image.prompt, url: image.url });
        return;
      }
      await navigator.clipboard.writeText(image.url);
      toast.success("Image link copied");
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const iconBtn =
    "grid size-9 place-items-center rounded-xl border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-secondary";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group card-soft mb-4 break-inside-avoid overflow-hidden"
    >
      <img
        src={image.url}
        alt={image.prompt}
        loading="lazy"
        decoding="async"
        width={image.width}
        height={image.height}
        className="w-full bg-secondary/40 object-cover"
      />
      <div className="space-y-3 p-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">{image.prompt}</p>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Download image" className={iconBtn}>
              <Download className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => save("png")}>Download PNG</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => save("jpg")}>Download JPG</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => save("webp")}>Download WebP</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button type="button" aria-label="Share image" className={iconBtn} onClick={share}>
            <Share2 className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Copy prompt"
            className={iconBtn}
            onClick={() => {
              void navigator.clipboard.writeText(image.prompt);
              toast.success("Prompt copied");
            }}
          >
            <Copy className="size-4" />
          </button>
          {onRegenerate ? (
            <button
              type="button"
              aria-label="Generate a similar image"
              className={iconBtn}
              onClick={() => onRegenerate(image)}
            >
              <RefreshCw className="size-4" />
            </button>
          ) : null}
          {onToggleFavorite ? (
            <button
              type="button"
              aria-label={image.favorite ? "Remove from favourites" : "Add to favourites"}
              aria-pressed={Boolean(image.favorite)}
              className={iconBtn}
              onClick={() => onToggleFavorite(image.id)}
            >
              <Heart className={`size-4 ${image.favorite ? "fill-current text-primary" : ""}`} />
            </button>
          ) : null}
          {onRemove ? (
            <button
              type="button"
              aria-label="Delete image"
              className={`${iconBtn} ml-auto`}
              onClick={() => onRemove(image.id)}
            >
              <Trash2 className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}