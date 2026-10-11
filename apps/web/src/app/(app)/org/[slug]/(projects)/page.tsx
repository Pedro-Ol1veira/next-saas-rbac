import { ability, auth, getCurrentOrg } from "@/auth/auth";
import Header from "@/components/header";
import ProjectList from "./projectList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Projects() {

  const permissions = await ability();
  const currentOrg = await getCurrentOrg();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        {permissions?.can("create", "Project") && (
          <Button
            render={<Link href={`/org/${currentOrg}/create-project`}/> }
            nativeButton={false}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        )}
      </div>

      {permissions?.can('get', 'Project') ? (
        <ProjectList />
      ) : (
        <p className="text-sm text-muted-foreground">
          You do not have permission to view projects.
        </p>
      )}

    </div>
  )
}
