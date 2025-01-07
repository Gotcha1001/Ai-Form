"use client";

import { SignedIn } from '@clerk/nextjs';
import React from 'react';
import SideNav from './_components/SideNav';

const DashboardLayout = ({ children }) => {
    return (
        <SignedIn>
            <div className="lg:w-64 lg:fixed">
                <SideNav />
            </div>
            <div className="lg:ml-64 flex-1">
                <div className="">{children}</div>
            </div>
        </SignedIn>
    );
};

export default DashboardLayout;
