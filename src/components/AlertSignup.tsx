import { useState } from "react"
import { useAlertSignup } from "@/hooks/useAlertSignup"
import { EmailDialog } from "./EmailDialog"
import { AlertSignupButton } from "./alerts/AlertSignupButton"
import { SubscribedAlert } from "./alerts/SubscribedAlert"
import { supabase } from "@/integrations/supabase/client"
import { AlertSignupLoggedOut } from "./alerts/AlertSignupLoggedOut"

interface AlertSignupProps {
  postcode: string
}

export const AlertSignup = ({ postcode }: AlertSignupProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const { isSubscribed, isLoading, handleEmailSubmit } = useAlertSignup(postcode)
  const [session, setSession] = useState<any>(null)

  // Check session on mount
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  })

  if (!session) {
    return <AlertSignupLoggedOut />
  }

  if (isSubscribed) {
    return <SubscribedAlert />
  }

  return (
    <>
      <div className="p-4 bg-[#8bc5be]/10 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="text-[#8bc5be]" size={20} />
          <h3 className="font-medium text-[#8bc5be]">Get Updates for This Area</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Stay informed about new planning applications near {postcode}
        </p>
        <Button 
          className="w-full bg-[#8bc5be] hover:bg-[#8bc5be]/90"
          onClick={() => setShowEmailDialog(true)}
          disabled={isSubscribed || isLoading}
        >
          {isLoading ? "Setting up..." : isSubscribed ? "Subscribed" : "Get Alerts"}
        </Button>
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