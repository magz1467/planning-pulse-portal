import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlertSignupButtonProps {
  isSubscribed: boolean
  isLoading: boolean
  onClick: () => void
}

export const AlertSignupButton = ({ isSubscribed, isLoading, onClick }: AlertSignupButtonProps) => {
  return (
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
          onClick={onClick}
          disabled={isSubscribed || isLoading}
        >
          {isLoading ? "Setting up..." : isSubscribed ? "Subscribed" : "Add to watchlist"}
        </Button>
      </div>
    </div>
  )
}