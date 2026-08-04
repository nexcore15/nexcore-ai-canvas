import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/** Dark is the default; the light class lives on <html>. */
export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("pixflow.theme");
    const isLight = stored === "light";
    setLight(isLight);
    document.documentElement.classList.toggle("light", isLight);
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    window.localStorage.setItem("pixflow.theme", next ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-secondary/50 text-foreground transition-colors hover:bg-secondary"
    >
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}