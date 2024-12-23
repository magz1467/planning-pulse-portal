import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const GetInTouch = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [type, setType] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !type) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('User data')
        .insert([
          {
            Email: email,
            Type: type,
            Marketing: true
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Thank you for getting in touch. We'll be in contact soon.",
      });

      setEmail("");
      setType("");
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              If you are a developer, council, or press, get in touch to hear more about our partnership options.
            </p>
            <button 
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Get in Touch</DialogTitle>
            <DialogDescription>
              Please provide your email and select your organization type.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Organization Type</Label>
              <RadioGroup value={type} onValueChange={setType} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="developer" id="developer" />
                  <Label htmlFor="developer">Developer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="council" id="council" />
                  <Label htmlFor="council">Council</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="press" id="press" />
                  <Label htmlFor="press">Press</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetInTouch;