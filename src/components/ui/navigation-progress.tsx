"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { useNavigationStore } from "@/lib/navigation-store"

export function NavigationProgress() {
  const router = useRouter()
  const { isNavigating, progress, pendingHref, updateProgress, completeNavigation, cancelNavigation } =
    useNavigationStore()
  const [isVisible, setIsVisible] = useState(false)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle navigation progress
  useEffect(() => {
    if (isNavigating) {
      // Show progress bar
      setIsVisible(true)

      // Clear any existing intervals
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current)

      // Start with 0 progress
      updateProgress(0)

      // Simulate progress up to 90% (reserving the last 10% for actual navigation)
      let currentProgress = 0
      progressIntervalRef.current = setInterval(() => {
        // Accelerate at the beginning, slow down as we approach 90%
        const increment = currentProgress < 30 ? 5 : currentProgress < 60 ? 3 : 1
        currentProgress = Math.min(currentProgress + increment, 90)
        updateProgress(currentProgress)

        // When we reach 90%, wait for actual navigation to complete the progress
        if (currentProgress === 90) {
          clearInterval(progressIntervalRef.current!)
        }
      }, 100)

      // Set a maximum timeout for navigation (10 seconds)
      navigationTimeoutRef.current = setTimeout(() => {
        if (pendingHref) {
          // Force navigation after timeout
          updateProgress(100)
          router.push(pendingHref)

          // Hide the progress bar after navigation
          setTimeout(() => {
            setIsVisible(false)
            completeNavigation()
          }, 500)
        }
      }, 10000)
    } else if (progress === 100) {
      // When navigation is complete, hide the progress bar after a short delay
      setTimeout(() => {
        setIsVisible(false)
      }, 500)
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current)
    }
  }, [isNavigating, progress, pendingHref, router, updateProgress, completeNavigation])

  // Handle escape key to cancel navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isNavigating) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
        if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current)
        setIsVisible(false)
        cancelNavigation()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isNavigating, cancelNavigation])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Progress value={progress} className="h-1 rounded-none" />
    </div>
  )
}
