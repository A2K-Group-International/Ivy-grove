import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getMenuItemsForRole } from "@/lib/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParentSettingsPopover from "./ParentSettingsPopover";

export function DashboardLayout() {
  const { signOut, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = getMenuItemsForRole(userRole);

  const isAdmin = userRole === "admin";
  const isParent = userRole === "parent";

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigateSettings = () => {
    navigate("/settings");
  };

  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full bg-gray-50">
        <Sidebar className="sidebar-enhanced">
          <SidebarHeader className="border-b border-gray-200">
            <div className="flex flex-col justify-center items-center gap-3 px-4 py-6">
              <div className="w-20 h-20 flex items-center justify-center bg-school-50 rounded-full border-2 border-school-200 shadow-sm">
                <img
                  src="/Ivy-logo.png"
                  className="w-16 h-16 object-contain"
                  alt="Ivy Grove Logo"
                />
              </div>

              <div className="text-center">
                <span className="font-bold text-school-700 text-sm leading-tight block">
                  Ivy Grove Magdalene
                </span>
                <span className="font-bold text-school-700 text-sm leading-tight block">
                  School, Inc.
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.includes(item.url)}
                        className={`w-full justify-start hover:bg-school-50 hover:text-school-700 transition-all duration-200 rounded-lg px-3 py-2.5 ${
                          location.pathname.includes(item.url)
                            ? "bg-school-100 text-school-700 shadow-sm border-l-4 border-school-600"
                            : "text-gray-600 hover:bg-school-50"
                        }`}
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon
                            className={`h-5 w-5 ${
                              location.pathname.includes(item.url)
                                ? "text-school-600"
                                : "text-gray-500"
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-gray-200 p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start gap-2 hover:bg-red-50 hover:text-red-700 text-gray-600 rounded-lg py-2.5 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      onClick={navigateSettings}
                      className="w-full justify-start gap-2 hover:bg-school-50 hover:text-school-700 text-gray-600 rounded-lg py-2.5 transition-all duration-200"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </Button>
                  )}
                  {isParent && <ParentSettingsPopover />}
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-hidden bg-gray-50">
          <div className="flex h-dvh flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white shadow-sm px-4 py-3 lg:px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center text-xs text-gray-500">
                  <span className="capitalize">{userRole}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
