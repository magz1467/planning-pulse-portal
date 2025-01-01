import { useState } from "react"
import { useAlertSignup } from "@/hooks/useAlertSignup"
import { EmailDialog } from "./EmailDialog"
import { AuthRequiredDialog } from "./AuthRequiredDialog"
import { AlertSignupButton } from "./alerts/AlertSignupButton"
import { SubscribedAlert } from "./alerts/SubscribedAlert"
import { supabase } from "@/integrations/supabase/client"

interface AlertSignupProps {
  postcode: string
}

export const AlertSignup = ({ postcode }: AlertSignupProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { isSubscribed, isLoading, handleEmailSubmit } = useAlertSignup(postcode)

  const handleSubscribe = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      setShowAuthDialog(true)
      return
    }

    setShowEmailDialog(true)
  }

  if (isSubscribed) {
    return <SubscribedAlert />
  }

  return (
    <>
      <AlertSignupButton 
        isSubscribed={isSubscribed}
        isLoading={isLoading}
        onClick={handleSubscribe}
      />
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