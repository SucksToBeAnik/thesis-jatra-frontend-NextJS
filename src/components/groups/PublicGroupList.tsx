import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { createClient } from "@/utils/supabase/server";
import { getUserSpecificOpenToJoinGroups } from "@/db-actions/groups";
import GroupJoinRequestButton from "./GroupJoinRequestButton";

export default async function PublicGroupList() {
  const supabase = createClient();
  const [data, error] = await getUserSpecificOpenToJoinGroups({
    db: supabase,
  });
  if (error) {
    return (
      <div className="text-center text-red-500">Error fetching groups</div>
    );
  }
  return (
    <div className="overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Available Groups</h1>
      <div className="flex flex-col gap-4 h-[70vh] overflow-y-auto">
        {data.length > 0 ? (
          data.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.bio}</CardDescription>
              </CardHeader>
              <CardContent>
                <GroupJoinRequestButton groupId={group.id} />
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500">No groups available</div>
        )}
      </div>
    </div>
  );
}
