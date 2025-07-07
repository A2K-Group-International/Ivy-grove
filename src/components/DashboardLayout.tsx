import { Outlet, Link, useLocation } from "react-router-dom";
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
import {
  LogOut,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardLayout() {
  const { signOut, userRole } = useAuth();
  const location = useLocation();
  
  const menuItems = getMenuItemsForRole(userRole);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <School className="h-6 w-6" />
              <span className="font-semibold">Ivy Grove School</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
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
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
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
