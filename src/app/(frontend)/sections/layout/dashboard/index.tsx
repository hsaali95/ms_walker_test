"use client";
import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Groups3Icon from "@mui/icons-material/Groups3";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import NoteIcon from "@mui/icons-material/Note";
import { usePathname, useRouter } from "next/navigation";
import { getUserData } from "@/utils/helper";
import { ROLE } from "@/utils/enums";
import UserMenu from "@/app/(frontend)/components/user-menu";
import { deleteCookies } from "@/utils/cookies";
import { USER_PROFILE_BASE_URL } from "@/utils/constant";
import Ms_walker from "../../../../../../public/assets/svg/ms_walker.svg";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
const drawerWidth = 240;

interface NavigationItem {
  segment: string;
  title: string;
  icon: React.ReactNode;
}

interface Props {
  window?: () => Window;
  children: React.ReactNode;
}

const ADMIN_PATHS: NavigationItem[] = [
  { segment: "survey", title: "Add Survey", icon: <NoteAltIcon /> },
  { segment: "all-survey", title: "All Survey", icon: <PostAddIcon /> },
  { segment: "register-user", title: "Register User", icon: <PersonAddIcon /> },
  { segment: "group", title: "Group", icon: <Groups3Icon /> },
  { segment: "team", title: "Team", icon: <Diversity3Icon /> },
  { segment: "activity", title: "Add Activity", icon: <NoteIcon /> },
  { segment: "all-activity", title: "All Activity", icon: <NoteAddIcon /> },
  // { segment: "login", title: "Logout", icon: <LogoutIcon /> },
];

const SALES_REF_PATHS: NavigationItem[] = [
  { segment: "survey", title: "Add Survey", icon: <NoteAltIcon /> },
  { segment: "activity", title: "Add Activity", icon: <NoteIcon /> },
  { segment: "all-activity", title: "All Activity", icon: <NoteAddIcon /> },
  // { segment: "login", title: "Logout", icon: <LogoutIcon /> },
];

const MANAGER_PATHS: NavigationItem[] = [
  { segment: "survey", title: "Add Survey", icon: <NoteAltIcon /> },
  { segment: "all-survey", title: "All Survey", icon: <PostAddIcon /> },
  { segment: "team", title: "Team", icon: <Diversity3Icon /> },
  { segment: "activity", title: "Add Activity", icon: <NoteIcon /> },
  { segment: "all-activity", title: "All Activity", icon: <NoteAddIcon /> },
  // { segment: "login", title: "Logout", icon: <LogoutIcon /> },
];

const ResponsiveDrawer: React.FC<Props> = ({ window, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navigationList, setNavigationList] = useState<NavigationItem[]>([]);
  const [userData, setUserData] = useState<any>();
  const pathname = usePathname();

  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    deleteCookies()
      .then(() => {
        location.reload();
        router.push("/login");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  useEffect(() => {
    getUserData()
      .then((res) => {
        const role = res?.user?.role_id;
        setUserData(res?.user);
        if (role === ROLE.ADMIN) setNavigationList(ADMIN_PATHS);
        else if (role === ROLE.AGENT) setNavigationList(SALES_REF_PATHS);
        else if (role === ROLE.MANAGER) setNavigationList(MANAGER_PATHS);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  const drawerContent = (
    <Box>
      <Box sx={{ px: 2 }}>
        <Image
          objectFit="cover"
          src={Ms_walker}
          alt={"Ms_walker"}
          style={{ width: "100%" }}
        />
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <UserMenu
          userName={userData?.name}
          avatarSrc={`${USER_PROFILE_BASE_URL}${userData?.image}`}
          email={userData?.email}
          onLogout={handleLogout}
        />
      </Box>
      <List>
        {navigationList.map((item) => (
          <ListItem key={item.segment} disablePadding sx={{ pr: 1 }}>
            <ListItemButton
              sx={{
                backgroundColor:
                  pathname === `/${item.segment}` ? "#370A13" : "",
                borderTopRightRadius: "30px",
                borderBottomRightRadius: "30px",
              }}
              onClick={() => {
                setMobileOpen(false);
                console.log("item", item);
                if (item.title === "Logout") {
                  handleLogout();
                } else {
                  router.push(`/${item.segment}`);
                }
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{ color: "white", p: 0, ml: -2 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: { sm: "flex" } }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: { xs: "#4F131F", md: "none" },
          borderRadius: { md: "30px" },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: { xs: "space-between", md: "flex-end" },
            p: 0,
          }}
          disableGutters
        >
          <Box sx={{ pl: 1, display: { md: "none" } }}>
            <Image
              objectFit="cover"
              src={Ms_walker}
              alt={"Ms_walker"}
              style={{ width: "100%" }}
            />
          </Box>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon sx={{ color: "#fff" }} />
          </IconButton>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <UserMenu
              userName={userData?.name}
              avatarSrc={`${USER_PROFILE_BASE_URL}${userData?.image}`}
              email={userData?.email}
              onLogout={handleLogout}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          "& .MuiPaper-root": {
            borderRadius: "30px !important",
          },
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "#4F131F",
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "#4F131F",
              left: "5px",
              top: "5px",
              height: "98%",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          pt: { xs: 6, md: 2, xl: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflowX: "hidden !important",
        }}
      >
        <Toolbar disableGutters />
        {children}
      </Box>
    </Box>
  );
};

export default ResponsiveDrawer;
