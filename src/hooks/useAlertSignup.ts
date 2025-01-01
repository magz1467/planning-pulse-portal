import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export const useAlertSignup = (postcode: string) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleEmailSubmit = async (radius: string) => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        throw new Error("User not authenticated")
      }

      // Check if user already has a record
      const { data: existingData, error: selectError } = await supabase
        .from('User_data')
        .select()
        .eq('Email', session.user.email)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError
      }

      let dbError
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('User_data')
          .update({
            Marketing: true,
            "Post Code": postcode,
            Radius_from_pc: parseInt(radius),
          })
          .eq('Email', session.user.email)
        dbError = error
      } else {
        // Insert new record
        const { error } = await supabase
          .from('User_data')
          .insert([
            {
              Email: session.user.email,
              Marketing: true,
              "Post Code": postcode,
              Radius_from_pc: parseInt(radius),
            }
          ])
        dbError = error
      }

      if (dbError) {
        throw dbError
      }

      setIsSubscribed(true)
      const radiusText = radius === "1000" ? "1 kilometre" : `${radius} metres`
      
      toast({
        title: "Added to watchlist",
        description: `You will now receive email alerts for planning applications within ${radiusText} of ${postcode}.`,
        duration: 5000,
      })
    } catch (error) {
      setIsSubscribed(false)
      toast({
        title: "Error setting up alerts",
        description: "There was a problem setting up your planning alerts. Please try again later.",
        variant: "destructive",
        duration: 5000,
      })
      console.error("Error in handleEmailSubmit:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isSubscribed,
    isLoading,
    handleEmailSubmit
  }
}