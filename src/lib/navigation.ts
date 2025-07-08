import {
  Home,
  Users,
  UserCheck,
  Baby,
  type LucideIcon,
  School,
  Megaphone,
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
    icon: Megaphone,
    roles: ["admin", "teacher", "parent"],
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "School Year",
    url: "/school-year",
    icon: School,
    roles: ["admin"],
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
