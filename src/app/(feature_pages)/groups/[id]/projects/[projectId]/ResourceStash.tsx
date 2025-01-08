"use client";

import { Resource } from "@/types/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import CreateResourceDialog from "./CreateResourceDialog";

interface ResourceStashProps {
  resources: Resource[];
  projectId: string;
}

export default function ResourceStash({
  resources,
  projectId,
}: ResourceStashProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resources</CardTitle>
        <CreateResourceDialog projectId={projectId} />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Added {new Date(resource.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {resource.resource_storage_id && (
                      <Link href={`/display-file?id=${resource.id}`}>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          View File
                        </Button>
                      </Link>
                    )}

                    {resource.resource_url && (
                      <Link
                        href={resource.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View URL
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <p className="text-muted-foreground mb-2">No resources found</p>
                <p className="text-sm text-muted-foreground">
                  Click "Add Resource" to get started
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
