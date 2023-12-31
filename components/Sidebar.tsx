'use client'

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
//importing icons
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import Box from './Box';
import SidebarItems from './SidebarItems';
import Library from './Library';
interface SidebarProps {
    children: React.ReactNode;
}
const Sidebar: React.FC<SidebarProps> = ({
    children
}) => {
    const pathname = usePathname();

    // array for possible routes
    const routes = useMemo(() => [
        // its gonna be active when the user not on /search
        {
            icon: HiHome,
            label: 'Home',
            active: pathname !== '/search',
            href: '/'
        },
        {
            icon: BiSearch,
            label: 'Search',
            active: pathname === '/search',
            href: '/search'
        }

    ], [pathname])
    return (
        <div className='flex h-full'>
            <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2 ">
                <Box>
                    <div className='flex flex-col gap-y-4 px-5 py-4'>
                        {routes.map((item) => (
                            <SidebarItems
                                key={item.label}
                                {...item}
                            />
                        ))}
                    </div>
                </Box>
                <Box className='overflow-y-auto h-full'>
                    <Library />
                </Box>
            </div>
            <main className='h-full flex-1 overflow-y-auto py-2 '>
                {children}
            </main>
        </div>
    );
};

export default Sidebar;