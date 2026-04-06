"use client"

import { useEffect, useRef } from "react"

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  /** Optional footer slot — e.g. action buttons. */
  footer?: React.ReactNode
  /** Max-width preset. Defaults to "md". */
  size?: "sm" | "md" | "lg"
}

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    // Focus the dialog for a11y
    dialogRef.current?.focus()
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative w-full ${SIZE_CLASSES[size]} rounded-2xl border border-slate-700 bg-[#0d1b2e] shadow-2xl outline-none animate-zoom-in animate-duration-200`}
      >
        {title && (
          <header className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-4">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </header>
        )}

        <div className="px-6 py-5 text-sm leading-relaxed text-slate-300">
          {children}
        </div>

        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-slate-800 px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
