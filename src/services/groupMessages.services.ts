import { supabase } from "@/lib/supabase";

type NewMessagePayload = {
  sender_id: string;
  group_id: string;
  content: string;
};

export const insertMessage = async (
  groupId: string,
  content: string
): Promise<GroupChatMessage> => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    throw new Error("User is not authenticated");
  }

  const payload: NewMessagePayload = {
    sender_id: session.user.id,
    group_id: groupId,
    content,
  };

  const { data, error } = await supabase
    .from("group_messages")
    .insert(payload)
    .select(
      `
      id,
      content,
      created_at,
      sender_id,
      users!sender_id (first_name, last_name)
    `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Format the message for broadcast
  const firstName = data.users?.first_name || "";
  const lastName = data.users?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown";

  return {
    id: data.id,
    content: data.content,
    user: { name: fullName },
    createdAt: data.created_at,
  };
};

export interface GroupChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

export const loadMessages = async (
  groupId: string,
  limit: number = 20,
  before?: string
): Promise<{ messages: GroupChatMessage[]; hasMore: boolean }> => {
  try {
    let query = supabase
      .from("group_messages")
      .select(
        `
            id,
            content,
            created_at,
            sender_id,
            users!sender_id (first_name, last_name)
          `
      )
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(limit + 1);

    if (before) {
      query = query.lt("created_at", before);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to load messages:", error);
      return { messages: [], hasMore: false };
    }

    const hasMore = (data?.length || 0) > limit;
    const messages = (hasMore ? data?.slice(0, -1) : data) || [];

    const formattedMessages: GroupChatMessage[] = messages.map((msg) => {
      const firstName = msg.users?.first_name || "";
      const lastName = msg.users?.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim() || "Unknown";

      return {
        id: msg.id,
        content: msg.content,
        user: { name: fullName },
        createdAt: msg.created_at,
      };
    });

    return { messages: formattedMessages.reverse(), hasMore };
  } catch (error) {
    console.error("Error loading messages:", error);
    return { messages: [], hasMore: false };
  }
};
