"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LibraryBig, LineChart, MessageSquare, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { desc, eq } from 'drizzle-orm';
import { useAuth, useUser } from '@clerk/nextjs';

const SideNav = () => {
    const menuList = [
        {
            id: 1,
            name: 'My Forms',
            icon: LibraryBig,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Responses',
            icon: MessageSquare,
            path: '/dashboard/responses'
        },

        {
            id: 4,
            name: 'Upgrade',
            icon: Shield,
            path: '/dashboard/upgrade'
        }
    ];

    const path = usePathname();

    const { user } = useUser();
    const [formList, setFormList] = useState([]);
    const [PercFileCreated, setPercFileCreated] = useState(0);

    useEffect(() => {
        user && GetFormList();
    }, [user])


    const GetFormList = async () => {
        const result = await db
            .select()
            .from(JsonForms)
            .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(JsonForms.id));
        console.log("Querying with email:", user?.primaryEmailAddress?.emailAddress);

        setFormList(result);

        const perc = (result.length / 3) * 100;
        setPercFileCreated(perc);
    };

    return (
        <div className="lg:w-64 lg:flex-shrink-0">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:flex-col lg:h-screen  gradient-background1">
                <div className="p-6 space-y-6">
                    <div className="space-y-2 flex flex-col gap-5">
                        {menuList.map((menu) => (
                            <Link key={menu.id} href={menu.path}>
                                <div className={`flex items-center space-x-2 p-2 rounded hover:bg-indigo-500 ${path === menu.path ? 'bg-indigo-600 text-white' : ''}`}>
                                    <menu.icon className="w-5 h-5 text-white" />
                                    <span className='text-white'>{menu.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Button className="w-full">+ Create Form</Button>

                    <div className="space-y-4">
                        <Progress value={PercFileCreated} className="w-full" />
                        <p className="text-sm text-center">
                            <strong>{formList?.length}</strong> Out Of <strong>3</strong> Files Created
                        </p>

                        <p className="text-sm text-center text-gray-600">
                            Upgrade your plan for unlimited AI form creations
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden">
                <div className="flex justify-between items-center p-2 px-10">
                    {menuList.map((menu) => (
                        <Link key={menu.id} href={menu.path}>
                            <div
                                className={`flex flex-col items-center p-2 ${path === menu.path ? 'text-blue-600' : 'text-gray-600'
                                    }`}
                            >
                                <menu.icon className="w-6 h-6" />
                                <span className="text-xs mt-1">{menu.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SideNav;
