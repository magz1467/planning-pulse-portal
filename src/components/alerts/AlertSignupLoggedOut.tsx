import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { Link } from "react-router-dom"

export const AlertSignupLoggedOut = () => {
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
        <Link to="/auth">
          <Button>
            Sign in to get alerts
          </Button>
        </Link>
      </div>
    </div>
  )
}