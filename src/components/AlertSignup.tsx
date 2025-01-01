import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EmailDialog } from "./EmailDialog"
import { AuthRequiredDialog } from "./AuthRequiredDialog"
import { supabase } from "@/integrations/supabase/client"

interface AlertSignupProps {
  postcode: string
}

export const AlertSignup = ({ postcode }: AlertSignupProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      setShowAuthDialog(true)
      return
    }

    setShowEmailDialog(true)
  }

  const handleEmailSubmit = async (radius: string) => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        throw new Error("User not authenticated")
      }

      // Check if user already has a record - note the capital E in Email
      const { data: existingData } = await supabase
        .from('User_data')
        .select()
        .eq('Email', session.user.email)
        .single()

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
      setShowEmailDialog(false)
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

  if (isSubscribed) {
    return (
      <div className="p-3 bg-primary-light/50 rounded-lg mb-4">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Check size={16} className="text-primary" />
          <span>Alerts set up for this area</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-4 bg-primary-light rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="text-primary" size={20} />
            <div>
              <h3 className="font-medium text-primary">Planning Alerts</h3>
              <p className="text-sm text-gray-600">Get notified about new applications</p>
            </div>
          </div>
          <Button
            variant={isSubscribed ? "outline" : "default"}
            onClick={handleSubscribe}
            disabled={isSubscribed || isLoading}
          >
            {isLoading ? "Setting up..." : isSubscribed ? "Subscribed" : "Add to watchlist"}
          </Button>
        </div>
      </div>
      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        postcode={postcode}
      />
      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog} 
      />
    </>
  )
}