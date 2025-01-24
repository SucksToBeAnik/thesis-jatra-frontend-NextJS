import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { getPublicDrafts } from "@/db-actions/project-drafts";

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

export default async function PapersPage() {
  const db = createClient();
  const draftsQuery = await getPublicDrafts(db);
  if (!draftsQuery.success) {
    throw new Error(draftsQuery.message);
  }
  const drafts = draftsQuery.data;

  if (!drafts.length) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[400px]">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">No Papers Available</p>
            <p className="text-muted-foreground">
              Check back later for new papers
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Research Papers</h1>

      <div className="grid gap-6">
        {drafts.map((draft) => (
          <Card key={draft.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{draft.title}</CardTitle>
                <Link href={`/papers/${draft.id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Paper
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Paper Preview */}
                <p className="text-muted-foreground line-clamp-2">
                  {draft.content}
                </p>

                {/* Group Members Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4" />
                    <h3 className="font-medium">Research Team</h3>
                  </div>

                  <div className="grid gap-2">
                    {draft.group_projects.thesis_groups.thesis_group_profiles.map(
                      (member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between bg-secondary/50 rounded-lg p-2"
                        >
                          <span className="font-medium">{member.username}</span>
                          <Badge
                            className={`${getRoleBadgeColor(
                              member.role
                            )} text-white`}
                          >
                            {member.role.toLowerCase()}
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Paper Details */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Published: {new Date(draft.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
