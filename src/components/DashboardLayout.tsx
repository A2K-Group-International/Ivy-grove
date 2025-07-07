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

export function DashboardLayout() {
  const { signOut, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = getMenuItemsForRole(userRole);

  const isAdmin = userRole === "admin";

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
      <div className="flex min-h-dvh w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex flex-col justify-center items-center gap-2 px-4 py-2">
              <div className="w-24">
                <img src="/ivy-logo.png" />
              </div>

              <span className="font-semibold text-school-600 text-center">
                Ivy Grove Magdalene School, Inc.
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 px-2 py-1 transition-all"
                        >
                          <item.icon className="h-5 w-5 text-school-600" />
                          <span className="text-base font-medium">
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
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="justify-start gap-2 hover:bg-school-600 hover:text-white"
                  >
                    <LogOut className="h-6 w-6" />
                    Logout
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" onClick={navigateSettings}>
                      <Settings className="h-12 w-12" />
                    </Button>
                  )}
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-end md:justify-start border-b gap-2 p-4">
              <div>
                <SidebarTrigger />
                <div className="flex-1" />
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
