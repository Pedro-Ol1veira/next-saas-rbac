import { z } from 'zod';

export const inviteSubject = z.tuple([
    z.enum([
        'manage',
        'create',
        'get',
        'delete', 
    ]),
    z.literal('Invite')
]);

export type InviteSubject = z.infer<typeof inviteSubject>