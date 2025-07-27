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
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  MapPin,
  PlusIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { useCreateParent } from "@/hooks/useParents";

const createParentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contact: z
    .string()
    .length(11, "Contact must be exactly 11 digits")
    .regex(/^\d+$/, "Contact must contain only numbers"),
  email: z.string().email("Email must be valid"),
  password: z.string().min(6, "Password must be at least 6 characters."),
  address: z.string().min(1, "Address is required"),
});

export function CreateParent() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { mutate: createParent, isPending } = useCreateParent();

  const form = useForm({
    resolver: zodResolver(createParentSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      contact: "",
      email: "",
      password: "123456",
      address: "",
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleCreateParent = async (
    values: z.infer<typeof createParentSchema>
  ) => {
    createParent(values, {
      onSuccess: () => {
        form.reset();
        setOpenDialog(false);
      },
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <form>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon /> Add Parent
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Parent</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateParent)}
                id="create-parent"
                className=""
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
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-school-600 font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            className="pl-10 focus:ring-ring"
                            placeholder="Enter your email"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-school-600 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={passwordVisible ? "text" : "password"}
                            className="pl-10 focus:ring-ring"
                            placeholder="Enter your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            tabIndex={-1}
                            className="absolute bg-transparent hover:bg-transparent inset-y-0 right-2 flex items-center text-school-600 hover:text-school-800"
                            onClick={togglePasswordVisibility}
                            aria-label={
                              passwordVisible
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {passwordVisible ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </Button>
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
            <Button form="create-parent" type="submit" disabled={isPending}>
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
