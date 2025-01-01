import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { RadiusSelect } from "./RadiusSelect"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  radius: z.string(),
})

type FormValues = z.infer<typeof formSchema>

interface EmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (radius: string) => void
  postcode: string
}

export const EmailDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  postcode 
}: EmailDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      radius: "100"
    }
  })

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values.radius)
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving notification preferences:', error)
      form.setError("root", {
        message: "There was an error saving your preferences. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[2000]"
        role="dialog"
        aria-labelledby="email-dialog-title"
        aria-describedby="email-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="email-dialog-title">Set up alerts for {postcode}</DialogTitle>
          <DialogDescription id="email-dialog-description">
            Choose how far from this postcode you want to receive alerts
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="radius"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadiusSelect 
                      value={field.value} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Setting up..." : "Confirm"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}