import { useState } from "react";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader, Lock, Mail } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Email must be valid"),
  password: z.string().min(4, "Password must be 6 characters."),
});

export default function Landing() {
  const currentYear = new Date().getFullYear();
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
      form.setError("password", { message: "Invalid credentials" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-school-50 to-school-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-border ">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-40 h-40 flex items-center justify-center">
              <img src="/Ivy-logo.png" className="w-full h-full bg-contain" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-school-800 sr-only">
                Ivy Grove Magdalene School, Inc.
              </CardTitle>
              <CardDescription className="text-school-600">
                Sign in to access your dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-6 py-4"
              >
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
                <div className="flex items-center justify-end">
                  <a
                    href="#"
                    className="text-sm text-school-600 hover:text-school-800 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader className="animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <footer className="p-1 bg-school-600">
        <p className="font-regular text-[0.8rem] text-white/80">
          Developed by{" "}
          <a href="http://a2kgroup.org" target="_blank">
            A2K Group Corporation <span> © {currentYear}</span>
          </a>
        </p>
      </footer>
    </div>
  );
}
