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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("User not authenticated")
      }

      // First check if user already has an alert for this postcode
      const { data: existingAlert } = await supabase
        .from('user_postcodes')
        .select()
        .eq('user_id', user.id)
        .eq('postcode', postcode)
        .maybeSingle()

      if (existingAlert) {
        // Update existing alert
        const { error } = await supabase
          .from('user_postcodes')
          .update({
            radius: radius,
            User_email: user.email
          })
          .eq('id', existingAlert.id)

        if (error) throw error

        toast({
          title: "Success",
          description: `Your alert radius has been updated to ${radius === "1000" ? "1 kilometre" : radius + " metres"} for ${postcode}.`,
        })
      } else {
        // Create new alert
        const { error } = await supabase
          .from('user_postcodes')
          .insert({
            user_id: user.id,
            postcode: postcode,
            radius: radius,
            User_email: user.email
          })

        if (error) throw error

        toast({
          title: "Success",
          description: `You will now receive alerts for planning applications within ${radius === "1000" ? "1 kilometre" : radius + " metres"} of ${postcode}.`,
        })
      }

      // Update local state to show subscribed status
      setIsSubscribed(true)
    } catch (error) {
      console.error('Error saving notification preferences:', error)
      toast({
        title: "Error",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Check subscription status on mount and when postcode changes
  useState(() => {
    const checkSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsSubscribed(false)
          return
        }

        const { data: subscription } = await supabase
          .from('user_postcodes')
          .select()
          .eq('user_id', user.id)
          .eq('postcode', postcode)
          .maybeSingle()

        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error('Error checking subscription:', error)
        setIsSubscribed(false)
      }
    }

    checkSubscription()
  }, [postcode])

  return {
    isSubscribed,
    isLoading,
    handleEmailSubmit
  }
}