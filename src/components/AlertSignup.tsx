import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EmailDialog } from "./EmailDialog"

interface AlertSignupProps {
  postcode: string
}

export const AlertSignup = ({ postcode }: AlertSignupProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = () => {
    setShowEmailDialog(true)
  }

  const handleEmailSubmit = async (email: string, radius: string) => {
    try {
      setIsSubscribed(true)
      setShowEmailDialog(false)
      const radiusText = radius === "1000" ? "1 kilometre" : `${radius} metres`;
      
      toast({
        title: "Subscription pending",
        description: `We've sent a confirmation email to ${email}. Please check your inbox and click the link to confirm your subscription for planning alerts within ${radiusText} of ${postcode}. The email might take a few minutes to arrive.`,
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
            disabled={isSubscribed}
          >
            {isSubscribed ? "Subscribed" : "Set up alerts"}
          </Button>
        </div>
      </div>
      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        postcode={postcode}
      />
    </>
  )
}