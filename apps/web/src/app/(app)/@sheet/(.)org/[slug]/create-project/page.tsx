import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InterceptedSheetContent } from '@/components/interceptedSheetContent';
import ProjectForm from '@/app/(app)/org/[slug]/create-project/projectForm';

export default function CreateProject() {
    return (
        <Sheet defaultOpen>
            <InterceptedSheetContent>
                <SheetHeader>
                    <SheetTitle>Create Project</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                    <ProjectForm />
                </div>
            </InterceptedSheetContent>
        </Sheet>
    )
}