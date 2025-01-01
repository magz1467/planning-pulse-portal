import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/integrations/supabase/client"
import { RadiusSelect } from "./RadiusSelect"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  radius: z.string(),
})

type FormValues = z.infer<typeof formSchema>

interface EmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (email: string, radius: string) => void
  applicationRef?: string
  postcode?: string
}

export const EmailDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  applicationRef,
  postcode 
}: EmailDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      radius: "100"
    }
  })

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)

    try {
      // Save user preferences
      const { error: dbError } = await supabase
        .from('User_data')
        .insert([
          {
            Email: values.email,
            Marketing: true,
            Post_Code: postcode,
            Radius_from_pc: parseInt(values.radius),
          }
        ])

      if (dbError) {
        throw dbError;
      }

      // Send verification email
      const { error: verificationError } = await supabase.functions.invoke('send-verification', {
        body: { 
          email: values.email,
          postcode,
          radius: values.radius,
          applicationRef 
        }
      });

      if (verificationError) {
        throw verificationError;
      }

      onSubmit(values.email, values.radius)
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
          <DialogTitle id="email-dialog-title">Set up planning alerts</DialogTitle>
          <DialogDescription id="email-dialog-description">
            Enter your email address to receive notifications about new planning applications
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                      aria-label="Email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}