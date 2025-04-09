import React from "react";
import DashboardLayoutBranding from "../sections/layout/dashboard";
const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DashboardLayoutBranding>{children}</DashboardLayoutBranding>;
};

export default layout;
