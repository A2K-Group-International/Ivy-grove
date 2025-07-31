import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addStudentToClass } from "@/services/class.service";
import CustomReactSelect from "../CustomReactSelect";
import { fetchUnassignedStudents } from "@/services/students.service";
import { useState } from "react";

const addStudentSchema = z.object({
  ids: z.array(z.string().min(1, "At least one student ID is required")),
});

type addStudentType = z.infer<typeof addStudentSchema>;
type AddStudentToClassProp = {
  schoolYearId: string;
  classId: string;
};
const AddStudentToClass = ({
  schoolYearId,
  classId,
}: AddStudentToClassProp) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["students", schoolYearId],
    queryFn: () => fetchUnassignedStudents(schoolYearId, classId),
    enabled: !!schoolYearId,
  });

  const form = useForm<addStudentType>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      ids: [],
    },
  });

  const addStudentMutation = useMutation({
    mutationFn: addStudentToClass,
    onSuccess: () => {
      setDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["students-per-class", classId],
      });
    },
    onError: (error) => {
      console.error("Error adding students:", error);
    },
  });

  const studentOptions = data?.map((student) => ({
    value: student.id,
    label: `${student.first_name} ${student.last_name}`,
  }));

  const handleSubmit = (data: addStudentType) => {
    addStudentMutation.mutate({ studentIds: data.ids, classId: classId });
    form.reset();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Students</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Students</DialogTitle>
          <DialogDescription>
            Select students to add to the class.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <CustomReactSelect
                      isMulti={true}
                      isLoading={isLoading}
                      options={studentOptions}
                      value={studentOptions?.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        field.onChange(
                          selectedOptions.map((option) => option.value)
                        );
                      }}
                      placeholder="Select students"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose type="button" asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
              <Button type="submit" disabled={addStudentMutation.isPending}>
                {addStudentMutation.isPending ? "Adding..." : "Add Students"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentToClass;
