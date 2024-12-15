import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
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

  const handleEmailSubmit = (email: string) => {
    setIsSubscribed(true)
    toast({
      title: "Alert set up successfully",
      description: `You will receive email alerts at ${email} for new planning applications near ${postcode}`,
      duration: 3000,
    })
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
      />
    </>
  )
}