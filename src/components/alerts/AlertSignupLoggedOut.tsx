import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { Link } from "react-router-dom"

export const AlertSignupLoggedOut = () => {
  return (
    <div className="p-4 bg-[#8bc5be]/10 rounded-lg mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="text-[#8bc5be]" size={20} />
        <h3 className="font-medium text-[#8bc5be]">Get Updates for This Area</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Stay informed about new planning applications near your area
      </p>
      <Link to="/auth">
        <Button className="w-full bg-[#8bc5be] hover:bg-[#8bc5be]/90">
          Sign in to get alerts
        </Button>
      </Link>
    </div>
  )
}