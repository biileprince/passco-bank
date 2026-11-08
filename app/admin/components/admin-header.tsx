"use client";

import { AdminUser } from "@/lib/admin";
import { Button } from "@/app/components/ui/button";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { LogOut, Bell } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AdminHeaderProps {
  admin: AdminUser;
}

export function AdminHeader({ admin }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-border px-3 sm:px-4 md:px-6 lg:px-8"
      style={{
        background: "hsl(var(--background) / 0.95)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      {/* Page Title */}
      <div className="hidden lg:block">
        <h1 className="text-base lg:text-lg font-semibold">Admin Panel</h1>
      </div>

      {/* Mobile Logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-foreground text-background">
          <span className="text-xs sm:text-sm font-bold">W</span>
        </div>
        <span className="text-base sm:text-lg font-bold">Admin</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 sm:h-9 sm:w-9"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-primary text-[9px] sm:text-[10px] font-bold text-primary-foreground">
            3
          </span>
        </Button>

        <ThemeToggle />

        {/* User Info */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-border">
          <div className="text-right hidden md:block">
            <p className="text-xs sm:text-sm font-medium">
              {admin.name || "Admin"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {admin.email}
            </p>
          </div>
          {admin.image ? (
            <Image
              src={admin.image}
              alt={admin.name || "Admin"}
              width={36}
              height={36}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-xs sm:text-sm font-medium">
                {admin.name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </header>
  );
}
