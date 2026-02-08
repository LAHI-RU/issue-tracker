import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyTheme, getInitialTheme, saveTheme, toggleTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  function onToggle() {
    const next = toggleTheme(theme);
    setTheme(next);
    applyTheme(next);
    saveTheme(next);
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggle}
      aria-label="Toggle theme"
      className="hover-lift"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
