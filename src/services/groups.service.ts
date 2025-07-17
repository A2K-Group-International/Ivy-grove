import { supabase } from "@/lib/supabase";

export interface CreateGroupData {
  name: string;
}

export const createGroup = async (groupData: CreateGroupData) => {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("groups")
    .insert({
      name: groupData.name,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create group: ${error.message}`);
  }

  return data;
};

export const fetchGroups = async () => {
  const { data, error } = await supabase
    .from("groups")
    .select("id, name")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch groups: ${error.message}`);
  }

  return data;
};

export interface EditGroupData {
  groupId: string;
  name: string;
}

export const editGroup = async (groupData: EditGroupData) => {
  const { data, error } = await supabase
    .from("groups")
    .update({
      name: groupData.name,
    })
    .eq("id", groupData.groupId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to edit group: ${error.message}`);
  }

  return data;
};

export const deleteGroup = async (groupId: string) => {
  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId);

  if (error) {
    throw new Error(`Failed to delete group: ${error.message}`);
  }

  return { success: true };
};
