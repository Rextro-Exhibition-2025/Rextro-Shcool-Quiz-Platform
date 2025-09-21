"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminMenu from "./AdminMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact Us" },
  { href: "/add-question", label: "Admin Portal" },
];

const NavBar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="w-full flex items-center justify-between px-8 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <Image
          src="/logo.png" // Place your logo in /public/logo.png
          alt="Faculty of Engineering Logo"
          width={120}
          height={60}
          style={{ objectFit: "contain" }}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-[#a67c52] font-semibold">
            25 Years of Innovation & Excellence
          </span>
          <span className="text-lg font-semibold text-[#4b2e83]">
            Faculty of Engineering
          </span>
          <span className="text-sm text-[#4b2e83]">University of Ruhuna</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        {navLinks.map((link, idx) => (
          <React.Fragment key={link.href}>
            <Link
              href={link.href}
              className={`font-semibold ${
                pathname === link.href
                  ? "text-[#4b2e83] border-b-2 border-[#4b2e83]"
                  : "text-gray-700 hover:text-[#a67c52] border-b-2 border-transparent"
              } pb-1 transition-colors`}
            >
              {link.label}
            </Link>
            {/* After Admin Portal button, show menu icon only if logged in as admin */}
            {link.label === "Admin Portal" && session && <AdminMenu />}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
