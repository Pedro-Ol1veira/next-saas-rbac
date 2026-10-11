'use client';

import { Check, UserPlus2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPedingInvites } from "@/http/getPedingInvites";
import { useState } from "react";
import { acceptInviteAction, rejectInviteAction } from "./actions";
dayjs.extend(relativeTime);

export default function PedingInvites() {

    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['peding-invites'],
        queryFn: getPedingInvites,
        enabled: isOpen,
    });

    async function handleAcceptInvite(inviteId: string) {
        await acceptInviteAction(inviteId);

        queryClient.invalidateQueries({ queryKey: ['peding-invites'] });
    }

    async function handleRejectInvite(inviteId: string) {
        await rejectInviteAction(inviteId);

        queryClient.invalidateQueries({ queryKey: ['peding-invites'] });
    }
    
    return(
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger 
                render={<Button size="icon" variant="ghost" />}
            >
                <UserPlus2 className="size-4" />
                <span className="sr-only">Pending Invites</span>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-2">
                <span className="block text-sm font-medium">Peding invites ({data?.invites.length ?? 0})</span>

                {data?.invites.length === 0 && (<p className="text-sm text-muted-foreground">No pending invites</p>)}

                {data?.invites.map(invite => (
                    <div className="space-y-2" key={invite.id}>
                        <p className="leading-relaxed text-muted-foreground">
                            <span className="font-medium text-foreground">{invite.author?.name ?? 'Someone'}</span>{' '}
                            invited you to join <span className="font-medium text-foreground">{invite.organization.name}</span>{' '} 
                            <span>{dayjs(invite.createdAt).fromNow()}</span>
                        </p>

                        <div className="flex gap-1">
                            <Button size="xs" variant="outline" onClick={() => handleAcceptInvite(invite.id)}>
                                <Check className="size-3 mr-1.5"/>
                                Accept
                            </Button>
                            <Button size="xs" variant="ghost" className="text-muted-foreground" onClick={() => handleRejectInvite(invite.id)}>
                                <X className="size-3 mr-1.5"/>
                                Reject
                            </Button>
                        </div>
                    </div>
                ))}
            </PopoverContent>
        </Popover>
        
    )
}