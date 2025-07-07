import {
  Home,
  Users,
  GraduationCap,
  UserCheck,
  Baby,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/context/AuthContext";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const menuItems: MenuItem[] = [
  // Admin only
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["admin"],
  },
  {
    title: "Announcement",
    url: "/announcement",
    icon: Users,
    roles: ["admin", "teacher", "parent"],
  },
  {
    title: "Teachers",
    url: "/teachers",
    icon: GraduationCap,
    roles: ["admin"],
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
    roles: ["admin", "teacher"],
  },

  {
    title: "Schedule",
    url: "/schedule",
    icon: UserCheck,
    roles: ["admin", "teacher"],
  },

  // Parent only
  {
    title: "My Children",
    url: "/children",
    icon: Baby,
    roles: ["parent"],
  },
];

export const getMenuItemsForRole = (role: UserRole | null): MenuItem[] => {
  if (!role) return [];
  return menuItems.filter((item) => item.roles.includes(role));
};
