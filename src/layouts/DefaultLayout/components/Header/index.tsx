
import React from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Button, Divider, InputAdornment, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export const Header: React.FC = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("auth/login"); 
    };
    const [searchQuery, setSearchQuery] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const username = localStorage.getItem("username") || "";
  
    return (
        // eslint-disable-next-line max-len
        <Box tw="bg-bg-paper h-[60px] border-b border-divider flex justify-between items-center px-24">
            <Box tw="flex">
                <TextField
                    placeholder="Enter the keyword..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        flex: 1,
                        minHeight: '30px',
                        width: '400px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'var(--color-primary-main)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--color-primary-dark)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--color-primary-main)', 
                            },
                            '& input': {
                                color: 'black',
                            },
                            '& input::placeholder': {
                                color: 'black',
                            },
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end" sx={{ mr: 0.5 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        padding: '2px',
                                        backgroundColor: 'var(--color-primary-main)',
                                        '&:hover': {
                                            backgroundColor: 'var(--color-primary-dark)',
                                        },
                                        color: 'var(--color-text-primary)',
                                    }}
                                >
                                    Search
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountCircleIcon
                    // eslint-disable-next-line max-len
                    onClick={(event: React.MouseEvent<SVGSVGElement>) => handleMenuOpen(event as unknown as React.MouseEvent<HTMLElement>)}
                    sx={{ cursor: 'pointer', marginRight: '8px', color:'var(--color-primary-main)' }}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: { minWidth: '200px', marginTop: '8px', borderRadius: '16px' },
                    }}
                >
                    <MenuItem sx={{ justifyContent: 'center' }}>
                        <Typography sx={{ color: 'black', px: 1 }} variant="body1">Username:</Typography>
                        <Typography sx={{ color: 'black' }} variant="body1">{username}</Typography>
                    </MenuItem>
                    <Divider sx={{ my: 1, mx: 2, backgroundColor: 'var(--color-primary-main)' }} />
                    <MenuItem sx={{ justifyContent: 'center' }} onClick={handleLogout}>
                        <LogoutIcon sx={{ color: 'var(--color-primary-main)' }} />
                        <Typography sx={{ color: 'black', ml: 1 }} variant="body2">Logout</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};