"use client";

import { ThesisGroupProfile } from "@/types/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface MemberListProps {
  members: ThesisGroupProfile[];
}

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

export default function MemberList({ members }: MemberListProps) {
  return (
    <Card className="w-full h-[700px] overflow-y-auto">
      <CardHeader>
        <CardTitle>Group Members ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar>
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{member.username}</h3>
                    <Badge
                      className={`${getRoleBadgeColor(member.role)} text-white`}
                    >
                      {member.role.toLowerCase()}
                    </Badge>
                  </div>

                  {member.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {member.bio}
                    </p>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Joined {new Date(member.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <div className="flex items-center justify-center h-[300px] text-center">
              <p className="text-muted-foreground">No members found</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
