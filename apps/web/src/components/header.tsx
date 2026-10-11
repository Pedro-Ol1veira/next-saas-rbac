import gitHubIcon from '../../public/githubIcon.svg'
import Image from 'next/image'
import { ProfileButton } from './profileButton'
import { Slash } from 'lucide-react'
import { OrganizationSwitcher } from './organizationSwitcher'
import { ability } from '@/auth/auth'
import { Separator } from './ui/separator'
import { ThemeSwitcher } from './theme/themeSwitcher'
import { ProjectSwitcher } from './projectSwitcher'
import PedingInvites from './pedingInvites'



export default async function Header() {

    const permisions = await ability();
    
    return (
        <div className="mx-auto flex max-w-300 items-center justify-between ">
            <div className="flex items-center gap-3">
                <Image src={gitHubIcon} alt="Logo" className='size-6 dark:invert'/>

                <Slash className='size-3 rotate-[-24deg] text-border'/>

                <OrganizationSwitcher />

                {permisions?.can('get', 'Project') && (
                    <>
                        <Slash className='size-3 rotate-[-24deg] text-border'/>
                        <ProjectSwitcher />
                    </>
                )}
            </div>

            <div className='flex items-center gap-4'>
                <PedingInvites />
                <ThemeSwitcher />
                <Separator orientation='vertical' className="h-9 "/>
                <ProfileButton />
            </div>
        </div>
    )
}