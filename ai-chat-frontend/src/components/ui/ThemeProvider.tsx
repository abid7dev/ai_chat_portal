// src/components/ui/ThemeProvider.tsx
import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-[--color-background] text-[--color-text]">
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-transform hover:scale-105"
      >
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>
      {children}
    </div>
  );
}
