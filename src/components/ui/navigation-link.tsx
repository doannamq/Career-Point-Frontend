"use client"

import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useNavigationStore } from "@/lib/navigation-store"

interface NavigationLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  activeClassName?: string
  prefetch?: boolean
  onClick?: () => void
  onNavigationStart?: () => Promise<boolean> | boolean
}

export function NavigationLink({
  href,
  children,
  className,
  activeClassName,
  prefetch,
  onClick,
  onNavigationStart,
  ...props
}: NavigationLinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const { isNavigating, startNavigation, updateProgress, completeNavigation } = useNavigationStore()

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default navigation
    e.preventDefault()

    // If already navigating, do nothing
    if (isNavigating) return

    // Call the onClick handler if provided
    if (onClick) {
      onClick()
    }

    // Start the navigation process
    startNavigation(href)

    // If there's a navigation start handler, call it
    if (onNavigationStart) {
      try {
        // This could be an API call or data fetching
        const shouldContinue = await onNavigationStart()

        // If the handler returns false, cancel navigation
        if (shouldContinue === false) {
          updateProgress(0)
          return
        }
      } catch (error) {
        console.error("Navigation error:", error)
        updateProgress(0)
        return
      }
    }

    // Complete the progress to 100%
    updateProgress(100)

    // Wait for the progress animation to complete
    setTimeout(() => {
      // Navigate to the new page
      window.location.href = href

      // Reset navigation state
      setTimeout(() => {
        completeNavigation()
      }, 500)
    }, 400)
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(className, isNavigating && "pointer-events-none opacity-70")}
      prefetch={prefetch}
      {...props}
    >
      {children}
    </Link>
  )
}
