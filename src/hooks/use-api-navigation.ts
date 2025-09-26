"use client"

import { useState } from "react"
import { useNavigationStore } from "@/lib/navigation-store"
import { useRouter } from "next/navigation"

export function useApiNavigation() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { startNavigation, updateProgress, completeNavigation, cancelNavigation } = useNavigationStore()

  const navigateWithApi = async (
    href: string,
    apiCall: () => Promise<any>,
    options?: {
      onSuccess?: (data: any) => void
      onError?: (error: any) => void
      progressSteps?: number[]
    },
  ) => {
    try {
      // Start navigation and show progress
      startNavigation(href)
      setIsLoading(true)

      // Default progress steps
      const progressSteps = options?.progressSteps || [30, 60, 90]

      // Update to first progress step
      updateProgress(progressSteps[0])

      // Call the API
      const data = await apiCall()

      // Update to second progress step
      updateProgress(progressSteps[1])

      // Call success callback if provided
      if (options?.onSuccess) {
        options.onSuccess(data)
      }

      // Update to third progress step
      updateProgress(progressSteps[2])

      // Small delay before completing navigation
      setTimeout(() => {
        // Complete the progress
        updateProgress(100)

        // Navigate to the new page
        setTimeout(() => {
          router.push(href)

          // Reset navigation state
          setTimeout(() => {
            completeNavigation()
            setIsLoading(false)
          }, 500)
        }, 400)
      }, 300)

      return data
    } catch (error) {
      // Call error callback if provided
      if (options?.onError) {
        options.onError(error)
      }

      // Cancel navigation
      cancelNavigation()
      setIsLoading(false)

      throw error
    }
  }

  return {
    navigateWithApi,
    isLoading,
  }
}
