import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "System configuration, database operations, and user management",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
