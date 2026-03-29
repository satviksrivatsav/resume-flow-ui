import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch - must wait for client-side render
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="w-9 h-9 rounded-full">
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    const isDark = (theme ?? "light") === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="relative w-9 h-9 overflow-hidden rounded-full border-primary/20 hover:bg-primary/5"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            {/* Sun icon - visible in dark mode */}
            <Sun
                className={`h-4 w-4 absolute transition-all duration-500 ease-in-out ${isDark
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
                    }`}
            />
            {/* Moon icon - visible in light mode */}
            <Moon
                className={`h-4 w-4 absolute transition-all duration-500 ease-in-out ${isDark
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                    }`}
            />
        </Button>
    );
}
