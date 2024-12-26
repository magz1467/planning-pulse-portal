import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Chatbot = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message || (!email && !phone)) {
      toast({
        title: "Error",
        description: "Please provide a message and either an email or phone number for us to contact you.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert([
          {
            email,
            phone,
            message
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Thank you for your message. A member of our team will contact you soon.",
      });

      // Reset form
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="text-xs text-gray-500">
          Or provide your phone number below
        </div>
        <Input
          type="tel"
          placeholder="Your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <Textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className="min-h-[100px]"
      />
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
};