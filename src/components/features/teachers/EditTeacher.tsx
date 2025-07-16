import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Home, Loader, Mail, User } from "lucide-react";
import { useUpdateTeacher } from "@/hooks/useTeacher";
import type { UserProfile } from "@/services/user.service";

const editTeacherSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contact: z
    .string()
    .length(11, "Contact must be exactly 11 digits")
    .regex(/^\d+$/, "Contact must contain only numbers"),
  address: z.string().min(1, "Address is required"),
});

interface EditTeacherProps {
  teacher: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTeacher({ teacher, isOpen, onClose }: EditTeacherProps) {
  const { mutate: updateTeacher, isPending } = useUpdateTeacher();

  const form = useForm({
    resolver: zodResolver(editTeacherSchema),
    defaultValues: {
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      contact: teacher.contact,
      address: teacher.address,
    },
  });

  const handleUpdateTeacher = async (
    values: z.infer<typeof editTeacherSchema>
  ) => {
    updateTeacher(
      {
        id: teacher.id,
        first_name: values.first_name,
        last_name: values.last_name,
        contact: values.contact,
        address: values.address,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Failed to update teacher:", error);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogDescription>
            Update the teacher's information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateTeacher)}
              id="edit-teacher"
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-x-2 gap-y-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm text-school-600 font-medium">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            className="pl-10 focus:ring-ring"
                            placeholder="First Name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm text-school-600 font-medium">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            className="pl-10 focus:ring-ring"
                            placeholder="Last Name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-school-600 font-medium">
                      Contact
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          className="pl-10 focus:ring-ring"
                          placeholder="Contact No."
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-school-600 font-medium">
                      Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          className="pl-10 focus:ring-ring"
                          placeholder="Enter address"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="edit-teacher" type="submit" disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-x-2">
                <Loader className="animate-spin" /> Updating
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}