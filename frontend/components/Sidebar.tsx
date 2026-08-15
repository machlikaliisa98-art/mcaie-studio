"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import styles from "./FonsAppShell.module.css";

type Creator = {
  full_name?: string;
  username?: string;
  creator_category?: string;
  verified?: boolean;
};

const listenerNavigation = [
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

const creatorNavigation = [
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
    label: "Creator Studio",
    href: "/studio",
    icon: "✦",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: "◫",
  },
  {
    label: "Live",
    href: "/live",
    icon: "◉",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [creator, setCreator] = useState<Creator | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("creator");

      if (stored) {
        setCreator(JSON.parse(stored));
      }
    } catch {
      setCreator(null);
    }
  }, []);

  const isCreator = Boolean(creator);

  const navigation = useMemo(() => {
    return isCreator
      ? creatorNavigation
      : listenerNavigation;
  }, [isCreator]);

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("creator");

    window.location.href = "/login";
  }

  const initials = creator?.full_name
    ? creator.full_name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "F";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <Link
          href="/landing"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/fons-logo.png"
            alt="FONS"
            className={styles.logo}
          />
        </Link>
      </div>

      <nav className={styles.navigation}>
        <div className={styles.navigationGroup}>
          <div className={styles.navigationLabel}>
            FONS
          </div>

          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  active
                    ? styles.navItemActive
                    : ""
                }`}
              >
                <span className={styles.navIcon}>
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {isCreator && (
          <div className={styles.navigationGroup}>
            <div className={styles.navigationLabel}>
              Creator
            </div>

            <Link
              href="/creators/andrew"
              className={`${styles.navItem} ${
                pathname.startsWith("/creators/")
                  ? styles.navItemActive
                  : ""
              }`}
            >
              <span className={styles.navIcon}>
                ◉
              </span>

              <span>Creator Page</span>
            </Link>

            <Link
              href="/projects"
              className={`${styles.navItem} ${
                pathname.startsWith("/projects")
                  ? styles.navItemActive
                  : ""
              }`}
            >
              <span className={styles.navIcon}>
                ◇
              </span>

              <span>Projects</span>
            </Link>
          </div>
        )}

        <div className={styles.navigationGroup}>
          <div className={styles.navigationLabel}>
            Account
          </div>

          <Link
            href="/settings"
            className={`${styles.navItem} ${
              pathname.startsWith("/settings")
                ? styles.navItemActive
                : ""
            }`}
          >
            <span className={styles.navIcon}>
              ⚙
            </span>

            <span>Settings</span>
          </Link>
        </div>
      </nav>

      <div className={styles.profileArea}>
        {creator ? (
          <>
            <Link
              href="/creators/andrew"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className={styles.profile}>
                <div className={styles.avatar}>
                  {initials}
                </div>

                <div className={styles.profileText}>
                  <div className={styles.profileName}>
                    {creator.full_name ||
                      "FONS Creator"}
                  </div>

                  <div className={styles.profileType}>
                    {creator.verified
                      ? "Verified Creator"
                      : "Creator"}
                  </div>
                </div>
              </div>
            </Link>

            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className={styles.navItem}
          >
            <span className={styles.navIcon}>
              →
            </span>

            <span>Sign in</span>
          </Link>
        )}
      </div>
    </aside>
  );
}