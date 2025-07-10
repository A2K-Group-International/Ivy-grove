import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getInitial = (name: string) => {
  return name
    ?.split(" ")
    ?.map((word) => word[0])[0]
    ?.toUpperCase();
};

export const formatDate = (date: Date | string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const formatTime = (date: Date | string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleTimeString(undefined, options);
};
