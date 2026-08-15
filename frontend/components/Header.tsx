"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./FonsAppShell.module.css";

type Creator = {
  full_name?: string;
  username?: string;
};

export default function Header() {
  const [creator, setCreator] =
    useState<Creator | null>(null);

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

  const initials = creator?.full_name
    ? creator.full_name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "F";

  return (
    <header className={styles.topbar}>
      <Link
        href="/landing"
        className={styles.mobileLogo}
        aria-label="FONS"
      >
        <img
          src="/fons-logo.png"
          alt="FONS"
        />
      </Link>

      <form
        className={styles.search}
        action="/search"
        method="GET"
      >
        <span className={styles.searchIcon}>
          ⌕
        </span>

        <input
          name="q"
          className={styles.searchInput}
          placeholder="Search conversations, creators, episodes..."
          aria-label="Search FONS"
        />
      </form>

      <div className={styles.topbarActions}>
        <Link
          href="/live"
          className={styles.iconButton}
          aria-label="Live"
        >
          ◉
        </Link>

        <Link
          href="/settings"
          className={styles.iconButton}
          aria-label="Settings"
        >
          ⚙
        </Link>

        <Link
          href={
            creator
              ? "/creators/andrew"
              : "/login"
          }
          className={styles.userChip}
        >
          <div className={styles.userChipAvatar}>
            {initials}
          </div>

          {creator && (
            <span className={styles.userChipName}>
              {creator.full_name}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}