"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F6F1E8",
      }}
    >
      <Sidebar />

      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Header />

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "40px 48px",
          }}
        >
          <div
            style={{
              maxWidth: 1500,
              margin: "0 auto",
            }}
          >
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}