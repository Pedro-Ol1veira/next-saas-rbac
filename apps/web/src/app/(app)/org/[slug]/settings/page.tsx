import { ability, getCurrentOrg } from "@/auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OrganizationForm from "../../organizationForm";
import { ShutdownOrganizationButton } from "./shutdownOrganizationButton";
import { getOrganization } from "@/http/getOrganization";
import { Billing } from "./billing";

export default async function Settings() {

    const currentOrg = await getCurrentOrg();
    const permissions = await ability();
    const canUptateOrg = permissions?.can("update", "Organization");
    const canGetBilling = permissions?.can("get", "Billing");
    const canShutdownOrg = permissions?.can("delete", "Organization");

    const { organization } = await getOrganization(currentOrg!);
    
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Settings</h1>

            <div className="space-y-4">
                {canUptateOrg && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Organization Settings
                            </CardTitle>
                            <CardDescription>
                                Update your organization details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrganizationForm isUpdating={true} inicialData={{
                                domain: organization.domain,
                                name: organization.name,
                                shouldAttachUserByDomain: organization.shouldAttachUserByDomain
                            }}/>
                        </CardContent>
                    </Card>
                )}

                {canGetBilling && <Billing />}

                {canShutdownOrg && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Shutdown Organization
                            </CardTitle>
                            <CardDescription>
                                This will delete all organization data and cannot be undone. Please proceed with caution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ShutdownOrganizationButton />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>  
    )
};