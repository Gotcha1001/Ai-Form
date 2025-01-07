"use client"; // This is the client-side directive

import React from "react";
import { usePathname } from "next/navigation";

function Footer() {
    const path = usePathname();

    if (path.includes("aiform")) {
        return null; // Do not render the footer if path includes 'aiform'
    }

    return (
        <footer className="gradient-background2 py-12 bg-opacity-20">
            <div className="mx-auto px-4 text-center text-gray-300">
                <p>© {new Date().getFullYear()} CodeNow101. All Rights Reserved</p>
            </div>
        </footer>
    );
}

export default Footer;
