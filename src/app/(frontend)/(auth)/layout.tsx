import React from "react";
import Box from "@mui/material/Box";
import AuthLayout from "../sections/layout/auth";
const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <AuthLayout>
        <Box>{children}</Box>
      </AuthLayout>
    </>
  );
};

export default layout;
