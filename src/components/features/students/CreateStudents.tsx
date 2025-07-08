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
import {
  Calendar,
  CalendarDays,
  Loader,
  PersonStanding,
  PlusIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchSchoolYears } from "@/hooks/useSchoolYear";
import type { SchoolYear } from "@/services/schoolYear.service";
import { format } from "date-fns";
import { useFetchParentsNoPagination } from "@/hooks/useParents";
import type { FetchParentNoPagination } from "@/services/user.service";
import { useCreateStudent } from "@/hooks/useStudent";

const createStudentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  parent_id: z.string().min(1, "Parent is required"),
  school_year_id: z.string().min(1, "School Year ID is required"),
  age: z.coerce.number().int().min(1, "Age is required"),
});

export function CreateStudents() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { mutate: createStudent, isPending } = useCreateStudent();
  const { data: schoolYears, isLoading: isSchoolYearsLoading } =
    useFetchSchoolYears();
  const { data: parents, isLoading: isParentsLoading } =
    useFetchParentsNoPagination();

  const form = useForm<z.infer<typeof createStudentSchema>>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      age: 0,
      school_year_id: "",
      parent_id: "",
    },
    mode: "onChange",
  });

  const handleCreateTeacher = async (
    values: z.infer<typeof createStudentSchema>
  ) => {
    createStudent(values, {
      onSuccess: () => {
        form.reset();
        setOpenDialog(false);
      },
    });
    console.log(values);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <form>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon />
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
                onSubmit={form.handleSubmit(handleCreateTeacher)}
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
                  name="school_year_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-school-600 font-medium">
                        School Year
                      </FormLabel>
                      <FormControl>
                        <SelectSchoolYear
                          data={schoolYears}
                          field={field}
                          isLoading={isSchoolYearsLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-school-600 font-medium">
                        Parent / Guardian
                      </FormLabel>
                      <FormControl>
                        <SelectParent
                          data={parents}
                          field={field}
                          isLoading={isParentsLoading}
                        />
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

type SelectSchoolYearProps = {
  data?: SchoolYear[] | undefined;
  field: {
    value: string;
    onChange: (value: string) => void;
  };
  isLoading: boolean;
};

function SelectSchoolYear({
  data = [],
  field,
  isLoading,
}: SelectSchoolYearProps) {
  // Format school year using date-fns
  const formatSchoolYear = (startDate: string, endDate: string) => {
    const startYear = format(new Date(startDate), "yyyy");
    const endYear = format(new Date(endDate), "yyyy");
    return `${startYear} - ${endYear}`;
  };
  // Find the id of the school year base on field id
  const selectedSchoolYear = data.find((sy) => sy.id === field.value);
  //Display the formatted date
  const selectedDisplayValue = selectedSchoolYear
    ? formatSchoolYear(
        selectedSchoolYear.start_date,
        selectedSchoolYear.end_date
      )
    : undefined;

  return (
    <div className="relative">
      <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger className="pl-10 w-full">
          <SelectValue placeholder="Select School Year">
            {selectedDisplayValue}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            data?.map((schoolYear) => (
              <SelectItem key={schoolYear.id} value={schoolYear.id}>
                {formatSchoolYear(schoolYear.start_date, schoolYear.end_date)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

type FetchParentsProp = {
  data?: FetchParentNoPagination[] | undefined;
  field: {
    value: string;
    onChange: (value: string) => void;
  };
  isLoading: boolean;
};

function SelectParent({ data = [], field, isLoading }: FetchParentsProp) {
  return (
    <div className="relative">
      <PersonStanding className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger className="pl-10 w-full">
          <SelectValue placeholder="Select Parent" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            data?.map((parent) => (
              <SelectItem key={parent.id} value={parent.id}>
                {parent.first_name} {parent.last_name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
