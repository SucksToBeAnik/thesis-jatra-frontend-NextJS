import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Calendar, FileText } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getPublicDraftGivenDraftId } from "@/db-actions/project-drafts";

function getRoleBadgeColor(role: string) {
  switch (role) {
    case "SUPERVISOR":
      return "bg-blue-500 hover:bg-blue-600";
    case "STUDENT":
      return "bg-green-500 hover:bg-green-600";
    case "EXAMINER":
      return "bg-purple-500 hover:bg-purple-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const draftId = params.id;

  const db = createClient();

  const drfatQuery = await getPublicDraftGivenDraftId(db, draftId);
  if (!drfatQuery.success) {
    throw new Error(drfatQuery.message);
  }
  const draft = drfatQuery.data;
  if (!draft) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[400px]">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">Draft Not Found</p>
            <p className="text-muted-foreground">
              This draft may have been removed or made private
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{draft.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Published:{" "}
                      {new Date(draft.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Content section with proper formatting */}
              <div className="prose prose-sm max-w-none">
                {draft.content ? (
                  draft.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p> There is no content in this draft</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>Research Team</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Group by role */}
                {["SUPERVISOR", "EXAMINER", "STUDENT"].map((role) => {
                  const membersWithRole =
                    draft.group_projects.thesis_groups.thesis_group_profiles.filter(
                      (member) => member.role === role
                    );

                  if (membersWithRole.length === 0) return null;

                  return (
                    <div key={role}>
                      <h3 className="text-sm font-medium mb-2">
                        {role.charAt(0) + role.slice(1).toLowerCase()}s
                      </h3>
                      <div className="space-y-2">
                        {membersWithRole.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                          >
                            <span>{member.username}</span>
                            <Badge
                              className={`${getRoleBadgeColor(
                                member.role
                              )} text-white`}
                            >
                              {member.role.toLowerCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
