import Grid from "@mui/material/Grid2";
import React from "react";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid container columnSpacing={{ xs: 0, md: 3 }}>
      <Grid
        size={{ xs: 0, lg: 6, xl: 6 }}
        sx={{
          background: `url(assets/images/ms_walker.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
      ></Grid>
      <Grid size={{ xs: 12, lg: 6, xl: 6 }}>{children}</Grid>
    </Grid>
  );
};

export default AuthLayout;
