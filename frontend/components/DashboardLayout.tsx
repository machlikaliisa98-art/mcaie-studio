"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Sidebar from "./Sidebar";
import Header from "./Header";

import styles from "./FonsAppShell.module.css";

type Props = {
  children: ReactNode;
};

const mobileNavigation = [
  {
    label: "Home",
    href: "/dashboard",
    icon: "⌂",
  },
  {
    label: "Explore",
    href: "/search",
    icon: "⌕",
  },
  {
    label: "Library",
    href: "/library",
    icon: "▣",
  },
  {
    label: "Episodes",
    href: "/episodes",
    icon: "▶",
  },
  {
    label: "Live",
    href: "/live",
    icon: "◉",
  },
];

export default function DashboardLayout({
  children,
}: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <main className={styles.shell}>
      <Sidebar />

      <section className={styles.main}>
        <Header />

        <div className={styles.content}>
          {children}
        </div>
      </section>

      <nav
        className={styles.mobileBottom}
        aria-label="Mobile navigation"
      >
        {mobileNavigation.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavItem} ${
                active
                  ? styles.mobileNavItemActive
                  : ""
              }`}
            >
              <span className={styles.mobileNavIcon}>
                {item.icon}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}