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
import { addClass } from "@/services/class.service";
import { useState } from "react";
import { PlusIcon } from "lucide-react";

const addClassSchema = z.object({
  className: z.string().min(1, "Class name is required"),
});

type addClassType = z.infer<typeof addClassSchema>;

type SchoolYearIdProp = {
  schoolYearId: string;
};

const AddClassForm = ({ schoolYearId }: SchoolYearIdProp) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<addClassType>({
    resolver: zodResolver(addClassSchema),
    defaultValues: {
      className: "",
    },
  });

  const createClassMutation = useMutation({
    mutationFn: addClass,
    onSuccess: () => {
      toast("Class created successfully!");
      form.reset();
    },
    onError: (error) => {
      toast("Something went wrong.", {
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["classes", schoolYearId],
      });
      setOpen(false);
    },
  });

  const handleSubmit = (data: addClassType) => {
    createClassMutation.mutate({
      schoolYearId: schoolYearId,
      className: data.className,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> Add Class
        </Button>
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
                Close
              </DialogClose>
              <Button
                type="submit"
                className="bg-school-600 text-white flex-1"
                disabled={createClassMutation.isPending}
              >
                {createClassMutation.isPending ? "Creating..." : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassForm;
