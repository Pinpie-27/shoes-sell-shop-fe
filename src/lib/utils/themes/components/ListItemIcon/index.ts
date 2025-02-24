import { Theme } from '@mui/material';

export const ListItemIcon = (theme: Theme) => ({
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                minWidth: 24,
                color: theme.palette.text.primary,
            },
        },
    },
});
