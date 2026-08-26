import { useEffect, useState } from "react"
import {
  HeartPulse,
  Moon,
  Sun,
} from "lucide-react"

export function BrandHeader() {
  const [darkMode, setDarkMode] =
    useState(true)

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "theme",
      )

    const isDark =
      savedTheme !== "light"

    setDarkMode(isDark)

    document.documentElement.classList.toggle(
      "light",
      !isDark,
    )
  }, [])

  function toggleTheme() {
    const nextDarkMode =
      !darkMode

    setDarkMode(nextDarkMode)

    document.documentElement.classList.toggle(
      "light",
      !nextDarkMode,
    )

    localStorage.setItem(
      "theme",
      nextDarkMode
        ? "dark"
        : "light",
    )
  }

  return (
    <header className="flex items-center justify-between gap-2.5 py-1">

      <div className="flex items-center gap-2.5">

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <HeartPulse
            className="h-5 w-5"
            strokeWidth={2.5}
          />
        </span>

        <span className="text-lg font-bold tracking-tight text-foreground">
          My Health Buddy
        </span>

      </div>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={
          darkMode
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        title={
          darkMode
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-all hover:bg-surface-raised hover:text-foreground"
      >
        {darkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

    </header>
  )
}