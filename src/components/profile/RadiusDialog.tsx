import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface RadiusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (radius: string) => void
  postcode: string
}

export const RadiusDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  postcode 
}: RadiusDialogProps) => {
  const [radius, setRadius] = useState("100")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      onSubmit(radius)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[2000]"
        role="dialog"
      >
        <DialogHeader>
          <DialogTitle>Set alert radius for {postcode}</DialogTitle>
          <DialogDescription>
            Choose how far from this postcode you want to receive alerts
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            defaultValue="100"
            value={radius}
            onValueChange={setRadius}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="100" id="r100" />
              <Label htmlFor="r100">Within 100 metres</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="500" id="r500" />
              <Label htmlFor="r500">Within 500 metres</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1000" id="r1000" />
              <Label htmlFor="r1000">Within 1 kilometre</Label>
            </div>
          </RadioGroup>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}