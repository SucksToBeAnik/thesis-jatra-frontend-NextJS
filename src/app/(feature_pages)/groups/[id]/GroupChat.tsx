import { getGroupMessages } from "@/db-actions/group-messages";
import { createClient } from "@/utils/supabase/client";
import GroupChatBox from "./GroupChatBox";

interface GroupChatProps {
  groupId: string;
  groupProfileUsername: string;
}

export default async function GroupChat({
  groupId,
  groupProfileUsername,
}: GroupChatProps) {
  const supabase = createClient();
  const initialMessages = await getGroupMessages(supabase, groupId);
  if (!initialMessages.success) {
    return <div>Failed to fetch messages</div>;
  }

  return (
    <GroupChatBox
      groupId={groupId}
      groupProfileUsername={groupProfileUsername}
      initialMessages={initialMessages.data}
    />
  );
}
