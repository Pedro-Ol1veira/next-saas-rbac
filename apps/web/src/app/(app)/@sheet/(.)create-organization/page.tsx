import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InterceptedSheetContent } from '@/components/interceptedSheetContent';
import OrganizationForm from '../../org/organizationForm';

export default function CreateOrganization() {
    return (
        <Sheet defaultOpen>
            <InterceptedSheetContent>
                <SheetHeader>
                    <SheetTitle>Create Organization</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                    <OrganizationForm />
                </div>
            </InterceptedSheetContent>
        </Sheet>
    )
}