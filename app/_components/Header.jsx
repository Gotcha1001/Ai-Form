"use client";

import MotionWrapperDelay from '@/components/FramerMotion/MotionWrapperDelay';
import { Button } from '@/components/ui/button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

function Header() {
    const { user, isSignedIn } = useUser();
    const path = usePathname()

    useEffect(() => {
        console.log(path)
    }, [])

    return !path.includes("aiform") && (
        <MotionWrapperDelay
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            variants={{
                hidden: { opacity: 0, x: -100 },
                visible: { opacity: 1, x: 0 },
            }}
        >
            <div className="relative p-5 shadow-sm overflow-hidden">
                {/* Moving background */}
                <div className="dynamic-bg absolute inset-0 -z-10"></div>

                {/* Content inside the header */}
                <div className="relative flex items-center justify-between">
                    <Link href="/">
                        <Image className='gradient-background4 p-1 rounded-xl' src="/logo.jpg" width={180} height={50} alt="logo" />
                    </Link>

                    {isSignedIn ? (
                        <div className="flex items-center gap-5">
                            <Link href="/dashboard">
                                <Button variant="sex">Dashboard</Button>
                            </Link>

                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-full w-full rounded-full",
                                        userButtonPopoverCard: "right-0",
                                    },
                                }}
                            />
                        </div>
                    ) : (
                        <SignInButton>
                            <Button variant="sex">Get Started</Button>
                        </SignInButton>

                    )}
                </div>
            </div>
        </MotionWrapperDelay>
    );
}

export default Header;
