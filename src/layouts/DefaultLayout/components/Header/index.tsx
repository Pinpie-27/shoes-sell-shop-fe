import React from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Divider, Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("auth/login");
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const username = localStorage.getItem("username") || "";

    return (
        <Box
            tw="bg-bg-paper h-[60px] border-b border-divider flex justify-between items-center px-[30px]"
            sx={{
                transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
                left: sidebarOpen ? "260px" : "0",
                width: sidebarOpen ? "calc(100vw - 260px)" : "100vw",
            }}
        >
            <Box tw="flex items-center">
                <MenuIcon
                    sx={{ color: "black", cursor: "pointer" }}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <NotificationsIcon sx={{ color: "black", cursor: "pointer" }}/>
                <AccountCircleIcon
                    onClick={(event) => handleMenuOpen(event as unknown as React.MouseEvent<HTMLElement>)}
                    sx={{ cursor: "pointer", marginLeft: "8px", color: "black" }}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{ sx: { minWidth: "200px", marginTop: "8px", borderRadius: "16px" } }}
                >
                    <MenuItem sx={{ justifyContent: "center" }}>
                        <Typography sx={{ color: "black", px: 1 }} variant="body1">
                    Username:
                        </Typography>
                        <Typography sx={{ color: "black" }} variant="body1">
                            {username}
                        </Typography>
                    </MenuItem>
                    <Divider sx={{ my: 1, mx: 2, backgroundColor: "var(--color-primary-main)" }} />
                    <MenuItem sx={{ justifyContent: "center" }} onClick={handleLogout}>
                        <LogoutIcon sx={{ color: "var(--color-primary-main)" }} />
                        <Typography sx={{ color: "black", ml: 1 }} variant="body2">
                    Logout
                        </Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};
