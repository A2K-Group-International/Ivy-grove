import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentProps } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";

const PasswordChangeSchema = z.object({
  newPassword: z.string().min(6, "Must have at least 6 characters"),
});

type PasswordChangeValues = z.infer<typeof PasswordChangeSchema>;

type TChangePasswordForm = ComponentProps<"form"> & {
  setOpen: (open: boolean) => void;
};

function ChangePasswordForm({ className, setOpen }: TChangePasswordForm) {
  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const onSubmit = ({ newPassword }: PasswordChangeValues) => {
    try {
      AuthService.updatePassword(newPassword);
      toast("Successfully changed password");
      setOpen(false);
    } catch {
      toast("Failed to update password. Try again");
    }
  };

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>New Password</FormLabel>
                <FormMessage />
              </div>

              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-3">
          Save
        </Button>
      </form>
    </Form>
  );
}

export default ChangePasswordForm;
