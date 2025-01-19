import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlertSignupButtonProps {
  isSubscribed: boolean
  isLoading: boolean
  onClick: () => void
}

export const AlertSignupButton = ({ isSubscribed, isLoading, onClick }: AlertSignupButtonProps) => {
  return (
    <Button
      variant={isSubscribed ? "outline" : "default"}
      onClick={onClick}
      disabled={isSubscribed || isLoading}
      size="sm"
    >
      {isLoading ? "Setting up..." : isSubscribed ? "Subscribed" : "Get Alerts"}
    </Button>
  )
}