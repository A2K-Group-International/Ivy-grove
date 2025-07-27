import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkStudentExists } from "@/services/studentValidation.service";
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
import { Calendar, Loader, Locate, User } from "lucide-react";
import { useUpdateStudent } from "@/hooks/useStudent";
import { toast } from "sonner";
import type { StudentProfile } from "@/services/students.service";

const editStudentSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  age: z.coerce
    .number()
    .int()
    .min(1, "Age must be at least 1")
    .max(30, "Age must be less than 30"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
});

type EditStudentFormData = z.infer<typeof editStudentSchema>;

type EditStudentProps = {
  student: StudentProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditStudent({ student, open, onOpenChange }: EditStudentProps) {
  const { mutate: updateStudent, isPending } = useUpdateStudent();

  const form = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      first_name: student.first_name,
      last_name: student.last_name,
      age: student.age,
      address: student.address,
    },
    mode: "onChange",
  });

  const handleUpdateStudent = async (values: EditStudentFormData) => {
    try {
      // Check for duplicate students only if name changed
      const nameChanged =
        values.first_name !== student.first_name ||
        values.last_name !== student.last_name;

      if (nameChanged) {
        const exists = await checkStudentExists(
          values.first_name,
          values.last_name,
          student.school_year_id,
          student.id
        );

        if (exists) {
          toast.warning(
            `Student "${values.first_name} ${values.last_name}" already exists in this school year`
          );
          return;
        }
      }

      updateStudent(
        {
          id: student.id,
          ...values,
        },
        {
          onSuccess: () => {
            toast.success("Student updated successfully!");
            form.reset();
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error("Failed to update student", {
              description: error.message,
            });
          },
        }
      );
    } catch (error) {
      console.error("Error checking student uniqueness:", error);
      toast.error("Error validating student. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update the student details below. Once completed, click Save to
            update the student information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateStudent)}
              id="edit-student"
              className="space-y-2"
            >
              <div className="flex flex-col md:flex-row gap-x-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-school-600 font-medium">
                      Age
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          className="pl-10 focus:ring-ring"
                          placeholder="Age"
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
                        <Locate className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          className="pl-10 focus:ring-ring"
                          placeholder="Address"
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
          <Button
            form="edit-student"
            type="submit"
            disabled={isPending}
            className="bg-school-600 text-white"
          >
            {isPending ? (
              <div className="flex items-center gap-x-2">
                <Loader className="animate-spin h-4 w-4" /> Updating...
              </div>
            ) : (
              "Update Student"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
