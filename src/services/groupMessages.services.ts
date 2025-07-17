import { supabase } from "@/lib/supabase";

type NewMessagePayload = {
  sender_id: string;
  group_id: string;
  content: string;
};

export const insertMessage = async (
  groupId: string,
  content: string
): Promise<void> => {
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

  const { error } = await supabase.from("group_messages").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
};
