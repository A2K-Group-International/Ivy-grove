import { supabase } from "@/lib/supabase";

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  added_by: string;
  created_at: string;

  // Expanded user details (from joins)
  user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export const fetchGroupMembers = async (groupId: string) => {
  const { data, error } = await supabase
    .from("group_members")
    .select(
      `
      id,
      group_id,
      user_id,
      added_by,
      created_at,
      user:users!user_id (
        id,
        first_name,
        last_name
      )
    `
    )
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch group members: ${error.message}`);
  }

  return data;
};

export const addGroupMembers = async (groupId: string, userIds: string[]) => {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const membersToAdd = userIds.map((userId) => ({
    group_id: groupId,
    user_id: userId,
    added_by: user.id,
  }));

  const { data, error } = await supabase
    .from("group_members")
    .insert(membersToAdd)
    .select();

  if (error) {
    throw new Error(`Failed to add group members: ${error.message}`);
  }

  return data;
};

export const removeGroupMember = async (groupId: string, userId: string) => {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to remove group member: ${error.message}`);
  }

  return { success: true };
};

export const fetchAvailableUsers = async (groupId: string) => {
  // First get existing member IDs
  const { data: existingMembers, error: membersError } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (membersError) {
    throw new Error(
      `Failed to fetch existing members: ${membersError.message}`
    );
  }

  const existingUserIds =
    existingMembers?.map((member) => member.user_id) || [];

  // Then get all users who are not in that list
  let query = supabase
    .from("users")
    .select("id, first_name, last_name")
    .order("first_name", { ascending: true });

  // If there are existing members, exclude them
  if (existingUserIds.length > 0) {
    query = query.not("id", "in", `(${existingUserIds.join(",")})`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch available users: ${error.message}`);
  }

  return data;
};
