import { getCurrentOrg, getCurrentMembership, ability } from "@/auth/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getMembers } from "@/http/getMembers";
import { getOrganization } from "@/http/getOrganization";
import { organizationSchema } from "@saas/auth";
import { ArrowLeftRight, Crown, UserMinus } from "lucide-react";
import Image from "next/image";
import { removeMemberAction } from "./actions";
import UpdateMemberRoleSelect from "./updateMemberRoleSelect";

export default async function MemberList() {
    
    const currentOrg = await getCurrentOrg();
    const permissions = await ability();

    const [memberShip, { members }, { organization }] = await Promise.all([
        getCurrentMembership(),
        getMembers(currentOrg!),
        getOrganization(currentOrg!)
    ])

    const authOrganization = organizationSchema.parse(organization);
    
    return(
        <div className="space-y-2">
            <h2 className="text-lg font-semibold">Members</h2>
            <div className="rounded border">
                <Table>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="py-2.5" style={{width: 48}}>
                                    <Avatar>
                                        <AvatarFallback />
                                        {member.avatarUrl && (
                                            <Image src={member.avatarUrl} alt="" width={32} height={32} className="aspect-square rounded-full" />
                                        )}
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-2.5">
                                    <div className="flex flex-col">
                                        <span className="font-medium inline-flex items-center gap-2">
                                            {member.name}
                                            {member.userID === memberShip?.userId && ' (me)'}
                                            {organization?.ownerId === member.userID && (
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Crown className="size-3"/>
                                                    Owner
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{member.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-2.5">
                                    <div className="flex items-center justify-end gap-2">
                                        {permissions?.can('transfer_ownership', authOrganization) && (
                                            <Button size="sm" variant="ghost">
                                                <ArrowLeftRight className="size-4 mr-2"/>
                                                Transfer Ownership
                                            </Button>
                                        )}

                                        <UpdateMemberRoleSelect 
                                            memberId={member.id}
                                            value={member.role}
                                            disabled={
                                                member.userID === memberShip?.userId || 
                                                member.userID === organization?.ownerId || 
                                                permissions?.cannot('update', "User")
                                            }
                                        />

                                        {permissions?.can('delete', "User") && (
                                            <form action={removeMemberAction.bind(null, member.id)}>
                                                <Button disabled={
                                                    member.userID === memberShip?.userId || member.userID === organization?.ownerId
                                                } type="submit" size="sm" variant="destructive">
                                                    <UserMinus className="size-4 mr-2"/>
                                                    Remove
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}