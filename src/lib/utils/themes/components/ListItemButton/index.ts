import { Theme } from '@mui/material';

export const ListItemButton = (theme: Theme) => ({
    MuiListItemButton: {
        styleOverrides: {
            root: {
                '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                    },
                },
            },
        },
    },
});
