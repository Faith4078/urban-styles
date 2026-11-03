import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oversized Bear Vest | Urban Styles",
  description: "Shop the Oversized Bear Vest by Urban Styles.",
};

export default function ProductLayout({ children }: LayoutProps<"/product/oversized-bear-vest">) {
  return children;
}
