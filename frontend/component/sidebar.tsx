"use client";

import { cn } from "@/lib/utils";
import { SIDEBAR_CONSTANTS } from "@/utils/constants";
import { SignOutButton } from "@clerk/nextjs";
import { CircleDollarSign, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const handleSideBarClick = (id: string) => {
    router.push(id);
  };
  if (pathName === "/login" || pathName === "/sign-up") {
    return null;
  }
  return (
    <div className="bg-primary w-1/5 h-full flex justify-between flex-col p-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="text-white h-9 w-9" />
          <span className="text-white font-semibold text-base">
            Personal Finance Manager
          </span>
        </div>
        <span className="text-gray-300 text-sm font-medium mt-8">Menu</span>
        <div className="ml-2 mt-4 flex flex-col gap-3">
          {SIDEBAR_CONSTANTS.map((item) => {
            const { icon: Icon, title, id } = item;
            const itemSelected =
              id === pathName ? "bg-woodsmoke2 border-shark" : "";
            return (
              <div
                key={id}
                className={cn(
                  "flex gap-2 cursor-pointer py-2 px-3 rounded-md w-[95%] border border-transparent",
                  itemSelected,
                )}
                onClick={() => handleSideBarClick(id)}
              >
                <Icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400">{title}</span>
              </div>
            );
          })}
        </div>
      </div>
      <SignOutButton redirectUrl="/login">
        <button className="flex gap-2 cursor-pointer bg-woodsmoke2 py-2 px-3 border border-shark rounded-md">
          <LogOut className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm">Log out</span>
        </button>
      </SignOutButton>
    </div>
  );
};

export default Sidebar;
