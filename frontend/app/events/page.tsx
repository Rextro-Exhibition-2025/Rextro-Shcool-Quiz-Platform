"use client";
import React from "react";
import { useRedirectToQuizIfAuthenticated } from '@/lib/authToken';

const page = () => {
  const { checking } = useRedirectToQuizIfAuthenticated();

  return checking ? (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#df7500]"></div>
    </div>
  ) : (
    <div>Events Page</div>
  );
};

export default page;
