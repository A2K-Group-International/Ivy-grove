import { supabase } from "@/lib/supabase";

export async function createAdminUser(email: string, password: string) {
  try {
    // Create user with admin role
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        role: "admin",
      },
      email_confirm: true,
    });

    if (error) throw error;

    console.log("Admin user created:", data);
    return data;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

export async function updateUserRole(
  userId: string,
  role: "admin" | "teacher" | "parent"
) {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}
