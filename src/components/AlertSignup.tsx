import { useState } from "react"
import { useAlertSignup } from "@/hooks/useAlertSignup"
import { EmailDialog } from "./EmailDialog"
import { Button } from "@/components/ui/button"
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
      <div className="p-6 bg-primary rounded-lg mb-4">
        <h2 className="text-2xl font-playfair text-white mb-3">Your Feed for Your Area</h2>
        <p className="text-white/90 mb-6">
          Showing high-impact developments recently listed near {postcode}. These applications may significantly affect your neighborhood.
        </p>
        <Button 
          className="w-full bg-white hover:bg-white/90 text-primary font-medium"
          onClick={() => setShowEmailDialog(true)}
          disabled={isSubscribed || isLoading}
        >
          Get Alerts
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