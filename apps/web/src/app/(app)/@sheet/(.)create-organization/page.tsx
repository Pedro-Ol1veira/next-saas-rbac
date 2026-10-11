import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import OrganizationForm from '../../create-organization/organizationForm';
import { InterceptedSheetContent } from '@/components/interceptedSheetContent';

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