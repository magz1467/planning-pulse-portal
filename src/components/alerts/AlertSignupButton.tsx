import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlertSignupButtonProps {
  isSubscribed: boolean
  isLoading: boolean
  onClick: () => void
}

export const AlertSignupButton = ({ isSubscribed, isLoading, onClick }: AlertSignupButtonProps) => {
  return (
    <div className="p-3 bg-[#9b87f5]/5 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="text-[#9b87f5]" size={16} />
          <h3 className="font-playfair text-[#9b87f5]">Your Feed</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClick}
          disabled={isSubscribed || isLoading}
          className="h-8"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}