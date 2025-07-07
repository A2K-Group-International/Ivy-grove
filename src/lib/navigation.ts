import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  UserCheck,
  ClipboardList,
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
    title: "Students",
    url: "/dashboard/students",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Teachers",
    url: "/dashboard/teachers",
    icon: GraduationCap,
    roles: ["admin"],
  },
  {
    title: "Classes",
    url: "/dashboard/classes",
    icon: BookOpen,
    roles: ["admin"],
  },

  // Teacher only
  {
    title: "Announcement",
    url: "/teacher-dashboard",
    icon: Home,
    roles: ["teacher"],
  },
  {
    title: "Attendance",
    url: "/teacher-dashboard/attendance",
    icon: UserCheck,
    roles: ["teacher"],
  },

  // Parent only
  {
    title: "My Dashboard",
    url: "/parent-dashboard",
    icon: Home,
    roles: ["parent"],
  },
  {
    title: "My Children",
    url: "/parent-dashboard/children",
    icon: Baby,
    roles: ["parent"],
  },
  {
    title: "Attendance",
    url: "/parent-dashboard/attendance",
    icon: UserCheck,
    roles: ["parent"],
  },
  {
    title: "Assignments",
    url: "/parent-dashboard/assignments",
    icon: ClipboardList,
    roles: ["parent"],
  },
  {
    title: "Schedule",
    url: "/parent-dashboard/schedule",
    icon: Calendar,
    roles: ["parent"],
  },
  {
    title: "Reports",
    url: "/parent-dashboard/reports",
    icon: FileText,
    roles: ["parent"],
  },
  {
    title: "Messages",
    url: "/parent-dashboard/messages",
    icon: MessageSquare,
    roles: ["parent"],
  },
];

export const getMenuItemsForRole = (role: UserRole | null): MenuItem[] => {
  if (!role) return [];
  return menuItems.filter((item) => item.roles.includes(role));
};
