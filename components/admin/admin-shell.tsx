"use client";

import { usePathname } from "next/navigation";
import AdminNav from "./admin-nav";

/** Login renders bare; every other admin route gets the sidebar chrome. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F4F1ED] text-ink">
      <AdminNav />
      <main className="mx-auto max-w-[1500px] px-5 py-7 nav:pl-[248px]">{children}</main>
    </div>
  );
}
