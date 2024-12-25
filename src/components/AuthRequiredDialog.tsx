import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AuthRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthRequiredDialog = ({
  open,
  onOpenChange,
}: AuthRequiredDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] z-[3000]">
        <AlertDialogHeader>
          <AlertDialogTitle>Sign in required</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              To save developments and get notified about updates, you'll need to create
              a free account or sign in.
            </p>
            <p className="text-muted-foreground">
              It only takes a minute and you can use your email address or Google
              account.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Link to="/auth">
            <AlertDialogAction asChild>
              <Button>Sign in or create account</Button>
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};