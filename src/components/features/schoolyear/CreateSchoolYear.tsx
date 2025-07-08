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
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useCreateSchoolYear } from "@/hooks/useSchoolYear";

const createSchoolYearSchema = z
  .object({
    start_date: z
      .date()
      .optional()
      .refine((val) => val instanceof Date, {
        message: "Start date is required",
      }),
    end_date: z
      .date()
      .optional()
      .refine((val) => val instanceof Date, {
        message: "End date is required",
      }),
  })
  .refine(
    (data) =>
      data.start_date instanceof Date &&
      data.end_date instanceof Date &&
      data.start_date < data.end_date,
    {
      path: ["end_date"],
      message: "End date must be after start date",
    }
  );

export function CreateSchoolYear() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { mutate: createSchoolYear, isPending } = useCreateSchoolYear();

  const form = useForm({
    resolver: zodResolver(createSchoolYearSchema),
    defaultValues: {
      start_date: undefined,
      end_date: undefined,
    },
  });

  const handleCreateParent = async (
    values: z.infer<typeof createSchoolYearSchema>
  ) => {
    // Convert Date to ISO string
    const payload = {
      ...values,
      start_date: values.start_date.toISOString(),
      end_date: values.end_date.toISOString(),
    };
    createSchoolYear(payload, {
      onSuccess: () => {
        form.reset();
        setOpenDialog(false);
      },
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>Add School Year</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add School Year</DialogTitle>
          <DialogDescription>
            Add a new school year for your academic term.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateParent)}
              id="create-school-year"
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          //   disabled={(date) =>
                          //     date < new Date() || date < new Date("1900-01-01")
                          //   }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          //   disabled={(date) =>
                          //     date < new Date() || date < new Date("1900-01-01")
                          //   }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
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
          <Button form="create-school-year" type="submit" disabled={isPending}>
            {isPending ? <Loader className="animate-spin" /> : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
