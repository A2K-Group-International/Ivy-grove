import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Email must be valid"),
  password: z.string().min(4, "Password must be 6 characters."),
});

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      form.setError("email", { message: "Invalid credentials" }); // optional
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your account information to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              id="login"
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-6 py-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="w-full"
                        placeholder="Enter your email"
                        {...field}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={passwordVisible ? "text" : "password"}
                        className="w-full"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="my-2 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <input type="checkbox" onClick={togglePasswordVisibility} />
                  <span>Show Password</span>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="login" type="submit" disabled={loading}>
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
