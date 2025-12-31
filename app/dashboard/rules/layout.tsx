import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rule Templates",
  description:
    "Manage dietary rules, constraints, and meal planning guidelines",
};

export default function RulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
