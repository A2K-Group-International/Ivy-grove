import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editClass } from "@/services/class.service";

const editClassSchema = z.object({
  className: z.string().min(1, "Class name is required"),
});

type EditClassType = z.infer<typeof editClassSchema>;

type EditClassFormProps = {
  classId: string;
  className: string;
  schoolYearId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EditClassForm = ({
  classId,
  className,
  schoolYearId,
  open,
  onOpenChange,
}: EditClassFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<EditClassType>({
    resolver: zodResolver(editClassSchema),
    defaultValues: {
      className: className,
    },
  });

  const editClassMutation = useMutation({
    mutationFn: editClass,
    onSuccess: () => {
      toast("Class updated successfully!");
      form.reset();
    },
    onError: (error) => {
      toast("Something went wrong.", {
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes", schoolYearId],
      });
      onOpenChange(false);
    },
  });

  const handleSubmit = (data: EditClassType) => {
    editClassMutation.mutate({
      classId: classId,
      className: data.className,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>Update the class name below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter class name"
                      className="w-full mb-4"
                      {...field}
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
                Cancel
              </DialogClose>
              <Button
                type="submit"
                className="bg-school-600 text-white flex-1"
                disabled={editClassMutation.isPending}
              >
                {editClassMutation.isPending ? "Updating..." : "Update Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassForm;
