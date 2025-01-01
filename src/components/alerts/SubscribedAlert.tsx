import { Check } from "lucide-react"

export const SubscribedAlert = () => {
  return (
    <div className="p-3 bg-primary-light/50 rounded-lg mb-4">
      <div className="flex items-center gap-2 text-sm text-primary">
        <Check size={16} className="text-primary" />
        <span>Alerts set up for this area</span>
      </div>
    </div>
  )
}