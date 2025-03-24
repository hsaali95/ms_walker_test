import React, { useState } from "react";
import {
  Tooltip,
  IconButton,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";

interface UserMenuProps {
  userName?: string;
  avatarSrc?: string;
  email?: string;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  userName,
  avatarSrc,
  onLogout,
  email,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: { md: "#C1ACB1" },
          p: 1,
          pr: 3,
          borderRadius: "30px",
        }}
      >
        <Tooltip title={email}>
          <IconButton sx={{ p: 0 }} onClick={handleOpenMenu}>
            <Avatar
              alt={userName || ""}
              src={avatarSrc}
              sx={{
                border: "2px solid #4F131F",
              }}
            />
            <Typography
              sx={{
                ml: 1,
                color: { xs: "#fff", md: "#4F131F" },
                fontWeight: 600,
              }}
            >
              {userName || ""}
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onLogout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
