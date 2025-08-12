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

const PasswordChangeSchema = z.object({
  oldPassword: z.string().min(1, "This is required"),
  newPassword: z.string().min(1, "This is required"),
});

type PasswordChangeValues = z.infer<typeof PasswordChangeSchema>;

function ChangePasswordForm({ className }: ComponentProps<"form">) {
  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: PasswordChangeValues) => {
    console.log("Password change submitted:", values);
  };

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <div className="flex justify-between">
                <FormLabel>Old Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
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
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}

export default ChangePasswordForm;
