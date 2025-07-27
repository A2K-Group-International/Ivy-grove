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

  // Start a transaction to create group and add creator as member
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: groupData.name,
      created_by: user.id,
    })
    .select()
    .single();

  if (groupError) {
    throw new Error(`Failed to create group: ${groupError.message}`);
  }

  // Add the creator as a member of the group
  const { error: memberError } = await supabase
    .from("group_members")
    .insert({
      group_id: group.id,
      user_id: user.id,
      added_by: user.id, // Creator adds themselves
    });

  if (memberError) {
    // If adding member fails, we should ideally rollback the group creation
    // For now, just log the error but don't fail the entire operation
    console.error("Failed to add creator as group member:", memberError);
  }

  return group;
};

export const fetchGroups = async () => {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Fetch only groups where the user is a member
  const { data, error } = await supabase
    .from("groups")
    .select(`
      id, 
      name,
      group_members!inner(user_id)
    `)
    .eq("group_members.user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch groups: ${error.message}`);
  }

  // Clean up the data structure to remove the join data
  const cleanedData = data?.map(group => ({
    id: group.id,
    name: group.name
  }));

  return cleanedData;
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
