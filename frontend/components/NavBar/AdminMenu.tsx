import React from "react";
import Link from "next/link";
import { LogOut, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const AdminMenu: React.FC = () => {
  const { data: session } = useSession();
  return (
    <div className="relative">
      {/* Shield icon header */}
      <div className="flex items-center justify-center py-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-gradient-to-r from-[#df7500] to-[#651321] rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
      </div>
      {/* Admin email info */}
      {session?.user?.email && (
        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
          <div className="font-semibold text-[#651321] text-sm mb-1">Logged in as</div>
          <div className="break-all text-[#4b2e83]">{session.user.email}</div>
        </div>
      )}
      <Link
        href="/add-question"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Add Question
      </Link>
      <Link
        href="/session-selection"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Session
      </Link>
      <Link
        href="/admin/logs"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Suspicious Activity Log
      </Link>
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 w-full px-4 py-2 text-[#651321] hover:bg-gray-100 border-t border-gray-100 text-left text-sm font-semibold"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
};

export default AdminMenu;
