"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  HelpCircle,
  Home,
  LineChart,
  LogOut,
  type LucideIcon,
  MessageCircle,
  Route,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/cn";
import { logoutUser } from "@/lib/auth-client";
import type { DashboardUser } from "@/components/dashboard/shell";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const MAIN: NavItem[] = [
  { href: "/dashboard", label: "Bosh sahifa", icon: Home },
  { href: "/dashboard/plan", label: "Mening rejam", icon: Route },
  { href: "/dashboard/practice", label: "Mashg'ulotlar", icon: BookOpen },
  { href: "/dashboard/tests", label: "Testlar", icon: ClipboardList },
  { href: "/dashboard/stats", label: "Statistika", icon: LineChart },
  { href: "/dashboard/chat", label: "Chat AI", icon: MessageCircle, badge: "YANGI" },
];

const SECONDARY: NavItem[] = [
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
  { href: "/dashboard/settings", label: "Sozlamalar", icon: Settings },
  { href: "/dashboard/help", label: "Yordam", icon: HelpCircle },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  user: DashboardUser;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export function Sidebar({ open, onClose, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-ink-100 bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b border-ink-100 px-5">
          <Link href="/dashboard" aria-label="Dashboard">
            <Logo />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {MAIN.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              }
              onNavigate={onClose}
            />
          ))}

          <div className="my-2 border-t border-ink-100" />

          {SECONDARY.filter((item) => user.isAdmin || item.href !== "/dashboard/admin").map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname.startsWith(item.href)}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {/* Account chip + logout */}
        <div className="border-t border-ink-100 p-3">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-xs font-bold text-white">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-ink-500">
                {user.email ?? user.phone ?? ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Chiqish
          </button>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const { icon: Icon, label, href, badge } = item;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-brand-50 text-brand-700"
          : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-accent-100 px-1.5 py-0.5 text-[9px] font-bold text-accent-700">
          {badge}
        </span>
      )}
    </Link>
  );
}
