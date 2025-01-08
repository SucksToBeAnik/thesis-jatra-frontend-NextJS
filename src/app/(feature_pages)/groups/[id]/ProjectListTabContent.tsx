import { GroupProject } from "@/types/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateProjectDialog from "./CreateProjectModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface ProjectListTabContentProps {
  groupId: string;
  projects: GroupProject[];
  groupProfileName: string;
}

export default function ProjectListTabContent({
  projects,
  groupId,
  groupProfileName,
}: ProjectListTabContentProps) {
  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-semibold">Ongoing Group Projects</h1>
        <CreateProjectDialog groupId={groupId} />
      </div>
      {projects.length > 0 ? (
        <>
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <h2>{project.name}</h2>
                    <Button asChild variant="link">
                      <Link
                        href={`${groupId}/projects/${project.id}?groupProfileUsername=${groupProfileName}`}
                      >
                        Start Working
                      </Link>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <p>Your group has not created any project yet</p>
      )}
    </div>
  );
}
