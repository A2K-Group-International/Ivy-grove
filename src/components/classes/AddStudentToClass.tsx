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
import { useMutation, useQuery } from "@tanstack/react-query";
import { addStudentToClass } from "@/services/class.service";
import CustomReactSelect from "../CustomReactSelect";
import { fetchStudentsNoPaginate } from "@/services/students.service";
import { useParams } from "react-router-dom";

const addStudentSchema = z.object({
  ids: z.array(z.string().min(1, "At least one student ID is required")),
});

type addStudentType = z.infer<typeof addStudentSchema>;

const AddStudentToClass = () => {
  const { id, classId } = useParams<{ id: string; classId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["students", id],
    queryFn: () => fetchStudentsNoPaginate(id),
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
      console.log("Students added successfully!");
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
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Students</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new class.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
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
              <DialogClose
                type="button"
                className="border-1 border-school-600 flex-1 rounded-3xl cursor-pointer"
              >
                Close
              </DialogClose>
              <Button
                type="submit"
                className="bg-school-600 text-white flex-1"
                disabled={addStudentMutation.isPending}
              >
                {addStudentMutation.isPending ? "Creating..." : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentToClass;
