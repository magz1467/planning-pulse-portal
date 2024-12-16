import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface EmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (email: string, radius: string) => void
}

export const EmailDialog = ({ open, onOpenChange, onSubmit }: EmailDialogProps) => {
  const [email, setEmail] = useState("")
  const [radius, setRadius] = useState("100")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, radius)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[2000]">
        <DialogHeader>
          <DialogTitle>Set up planning alerts</DialogTitle>
          <DialogDescription>
            Enter your email address to receive notifications about new planning applications
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className="space-y-3">
            <Label>Notification radius</Label>
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
          </div>

          <Button type="submit" className="w-full">Subscribe</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}