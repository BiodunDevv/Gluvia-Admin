import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs",
  description: "Track administrative actions, user activity, and system events",
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
