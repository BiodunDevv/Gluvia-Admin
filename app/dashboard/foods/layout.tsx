import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foods Database",
  description:
    "Manage food items, nutritional information, and glycemic index data",
};

export default function FoodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
