import { ability } from '@/auth/auth';
import Invites from './invites';
import MemberList from './memberList';

export default async function MembersPage() {
    const permisions = await ability();

    return(
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Members</h1>
            <div className="space-y-4">
                {permisions?.can('get', 'Invite') && <Invites />}
                {permisions?.can('get', 'User') && <MemberList />}
            </div>
        </div>
    )
}