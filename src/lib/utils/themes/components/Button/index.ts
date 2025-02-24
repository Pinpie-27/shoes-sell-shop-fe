export const Button = () => ({
    MuiButton: {
        defaultProps: {
            disableElevation: true,
        },
        styleOverrides: {
            root: {
                fontWeight: 400,
                '&::after': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 4,
                    opacity: 0,
                    transition: 'all 0.5s',
                },

                '&:active::after': {
                    position: 'absolute',
                    borderRadius: 4,
                    left: 0,
                    top: 0,
                    opacity: 1,
                    transition: '0s',
                },
            },
        },
    },
});
