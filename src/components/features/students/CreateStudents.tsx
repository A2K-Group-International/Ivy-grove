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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Loader, Locate, PlusIcon, User } from "lucide-react";
import { useState } from "react";
import { useCreateStudent } from "@/hooks/useStudent";

const createStudentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  age: z.coerce.number().int().min(1, "Age is required"),
  address: z.string().min(1, "Address is required"),
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
