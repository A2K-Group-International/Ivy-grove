import { useEffect, useMemo, useState } from "react";
// import parishBanner from "../assets/images/SaintLaurence_bg.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const emailSchema = z.object({
  email: z.string().email(),
});

const contactSchema = z.object({
  contactNumber: z
    .string()
    .trim()
    .refine(
      (value) => {
        // Remove all spaces, dashes, and parentheses
        const cleaned = value.replace(/[\s\-()]/g, "");

        // UK numbers can start with:
        // - 07 for mobile (followed by 9 digits)
        // - 01, 02, 03 for landlines (followed by 9 digits)
        // - +44 or 0044 international format (followed by 10 digits, removing the initial 0)

        // Check if it's a valid UK format
        const mobileRegex = /^07\d{9}$/; // Mobile: 07xxx xxx xxx
        const landlineRegex = /^0(1|2|3)\d{9}$/; // Landline: 01xxx xxx xxx, 02xxx xxx xxx, 03xxx xxx xxx
        const internationalRegex = /^(\+44|0044)\d{10}$/; // International: +44 xxxx xxx xxx or 0044 xxxx xxx xxx

        return (
          mobileRegex.test(cleaned) ||
          landlineRegex.test(cleaned) ||
          internationalRegex.test(cleaned)
        );
      },
      {
        message: "Please enter a valid contact number",
      }
    ),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "you must input your current password."),
    password: z.string().min(6, "Password must be 6 digits"),
    confirmPassword: z.string().min(1, "Retype your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password must be match",
    path: ["confirmPassword"],
  });

function Settings() {
  const { userProfile } = useAuth();

  return (
    <>
      <div className="flex flex-col gap-y-28 md:gap-y-40">
        {/* Banner */}
        <div
          className="relative h-32 w-full rounded-xl bg-cover bg-no-repeat md:h-60"
          style={{
            // backgroundImage: `url(${parishBanner})`,
            backgroundPosition: "center 87%",
          }}
        >
          {/* Avatar */}
          <div className="absolute -bottom-14 left-3 flex items-center gap-x-2 md:-bottom-16 md:left-16 lg:-bottom-20 lg:left-24">
            <div className="relative flex h-24 w-24 cursor-auto items-center justify-center rounded-full border-[7px] border-white bg-accent text-2xl text-white md:h-32 md:w-32 md:text-4xl lg:h-40 lg:w-40">
              <img
                src="/ivy-logo.png"
                alt="Profile Picture"
                className="h-full w-full overflow-hidden rounded-full object-contain"
              />
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-4 md:mt-16 md:text-4xl lg:mt-20 lg:text-5xl">
              {/* <p className="text-lg font-bold text-accent">{`${data?.first_name} ${data?.last_name}`}</p> */}
              {/* <EditNameForm
                userId={data?.id}
                firstName={data?.first_name}
                lastName={data?.last_name}
              /> */}
            </div>
          </div>
        </div>
        {/* Information */}
        <div className="md:px-32 lg:pl-48 lg:pr-72">
          <div className="flex flex-col gap-y-4">
            <Label className="text-sm font-bold text-school-600">Email</Label>
            <div className="flex items-center justify-between rounded-xl bg-school-400 px-6 py-5 font-semibold text-white">
              <p>{userProfile?.email ?? "No email found"}</p>
              {/* <EditEmailForm userId={data?.id} /> */}
            </div>
            <Label className="text-sm font-bold text-school-600">Contact</Label>
            <div className="flex items-center justify-between rounded-xl bg-school-400 px-6 py-5 font-semibold text-white">
              <p>{userProfile?.contact ?? "No contact provided"}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <p className="text-school-600">Change Password</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
