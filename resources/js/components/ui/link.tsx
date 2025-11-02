"use client"

import { Link as LinkPrimitive, type LinkProps } from "react-aria-components"
import { cx } from "@/lib/primitive"

export function Link({ className, ...props }: LinkProps) {
  return (
    <LinkPrimitive
      className={cx(
        [
          "font-medium text-(--text)",
          "outline-0 outline-offset-2 transition-[color,_opacity] focus-visible:outline-2 focus-visible:outline-ring forced-colors:outline-[Highlight]",
          "disabled:cursor-default disabled:text-muted-fg forced-colors:disabled:text-[GrayText]",
          "href" in props && "cursor-pointer",
        ],
        className,
      )}
      {...props}
    />
  )
}
