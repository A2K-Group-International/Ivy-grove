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
      form.setError("root", { message: "Invalid credentials" });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-2 z-10">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-24 flex items-center justify-center">
            <img src="/Ivy-logo.png" className="w-full h-full bg-contain" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-school-600">
              Ivy Grove Magdalene School, Inc.
            </CardTitle>
            <CardDescription className="text-school-600">
              Sign in to access your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
                            passwordVisible ? "Hide password" : "Show password"
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
              <div className="flex items-center justify-between">
                <div>
                  {form.formState.errors.root && (
                    <p className="text-red-600 text-sm">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                </div>
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
  );
};

export default Login;
