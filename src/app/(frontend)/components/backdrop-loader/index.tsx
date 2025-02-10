"use client";
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import MsWalker from "../../../../../public/assets/svg/ms_walker.svg";
import Image from "next/image";
interface BackdropLoaderProps {
  open?: boolean; // Default to `true` if not provided
}

const BackdropLoader: React.FC<BackdropLoaderProps> = ({ open = true }) => {
  return (
    <Backdrop
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.drawer + 1,
        "& .ms_walker": {
          zIndex: "999",
        },
      })}
      open={open}
    >
      <Image src={MsWalker} alt="ms_walker" />
    </Backdrop>
  );
};

export default BackdropLoader;
