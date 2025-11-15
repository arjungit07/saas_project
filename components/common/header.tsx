'use client';

import { FileText } from "lucide-react";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
    const isLoggedIn = false;

    return (
        <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto relative z-50">
            <div className="flex">
                <NavLink href="/" className="flex items-center gap-1 lg:gap-2 shrink-0 group">
                    <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 transform transition duration-200 ease-in-out group-hover:rotate-12" />
                    <span className="font-extrabold lg:text-xl text-gray-900">Sommaire</span>
                </NavLink>
            </div>

            <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
                <a href="#pricing" className="transition-colors text-sm duration-200 text-gray-600 hover:text-rose-500">
                    Pricing
                </a>
                <SignedIn> <NavLink href="/dashboard">Your Summary</NavLink></SignedIn>
            </div>

            <div className="flex lg:justify-end">
                <SignedIn>
                    <div className="flex gap-2 items-center">
                        <NavLink href="/upload">Upload a PDF</NavLink>
                        <div>Pro</div>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </SignedIn>
                <SignedOut>
                    <NavLink href="/sign-in">Sign In</NavLink>
                </SignedOut>
            </div>
        </nav>
    );
}
