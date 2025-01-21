import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const AlertSignupLoggedOut = () => {
  return (
    <div className="p-6 bg-primary rounded-lg mb-4">
      <h2 className="text-2xl font-playfair text-white mb-3">Your Feed for Your Area</h2>
      <p className="text-white/90 mb-6">
        Showing high-impact developments recently listed near your area. These applications may significantly affect your neighborhood.
      </p>
      <Link to="/auth">
        <Button className="w-full bg-white hover:bg-white/90 text-primary font-medium">
          Get Alerts
        </Button>
      </Link>
    </div>
  )
}