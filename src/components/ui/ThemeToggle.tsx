import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    console.log("[ThemeToggle] Render - mounted:", mounted, "theme:", theme, "resolvedTheme:", resolvedTheme);

    // Avoid hydration mismatch - must wait for client-side render
    useEffect(() => {
        console.log("[ThemeToggle] useEffect - setting mounted to true");
        setMounted(true);
    }, []);

    if (!mounted) {
        console.log("[ThemeToggle] Not mounted yet, returning placeholder");
        return (
            <Button variant="outline" size="icon" className="w-9 h-9">
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    const isDark = (theme ?? "light") === "dark";
    console.log("[ThemeToggle] isDark:", isDark, "theme:", theme);

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark";
        console.log("[ThemeToggle] CLICK! Toggling from", theme, "to", newTheme);
        setTheme(newTheme);
        console.log("[ThemeToggle] setTheme called with:", newTheme);
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => {
                console.log("[ThemeToggle] onClick handler fired!");
                toggleTheme();
            }}
            className="relative w-9 h-9 overflow-hidden"
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
