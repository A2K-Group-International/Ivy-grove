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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Loader, Locate, PlusIcon, User } from "lucide-react";
import { useState } from "react";
import { useCreateStudent } from "@/hooks/useStudent";
import { toast } from "sonner";

const createStudentSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  age: z.coerce.number().int().min(1, "Age must be at least 1"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
});

type SchoolYearProps = {
  schoolYearId: string;
};

export function CreateStudents({ schoolYearId }: SchoolYearProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { mutate: createStudent, isPending } = useCreateStudent();

  const form = useForm<z.infer<typeof createStudentSchema>>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      age: 0,
      address: "",
    },
    mode: "onChange",
  });

  const handleCreateStudent = async (
    values: z.infer<typeof createStudentSchema>
  ) => {
    try {
      // Check for duplicate students before creating
      const exists = await checkStudentExists(
        values.first_name,
        values.last_name,
        schoolYearId
      );

      if (exists) {
        toast.warning(
          `Student "${values.first_name} ${values.last_name}" already exists in this school year`
        );
        return;
      }

      createStudent(
        {
          ...values,
          school_year_id: schoolYearId,
        },
        {
          onSuccess: () => {
            form.reset();
            setOpenDialog(false);
          },
        }
      );
    } catch (error) {
      console.error("Error checking student uniqueness:", error);
      form.setError("first_name", {
        type: "manual",
        message: "Error validating student. Please try again.",
      });
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <form>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon /> Add Student
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Fill out the student details below to register a new student. Once
              completed, click Save to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateStudent)}
                id="create-student"
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
            <Button form="create-student" type="submit" disabled={isPending}>
              {isPending ? (
                <div className="flex items-center gap-x-2">
                  <Loader className="animate-spin" /> Adding
                </div>
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
