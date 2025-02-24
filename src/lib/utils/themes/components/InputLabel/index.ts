export const InputLabel = () => ({
    MuiInputLabel: {
        styleOverrides: {
            outlined: {
                lineHeight: '0.8em',
                '&.MuiInputLabel-sizeSmall': {
                    lineHeight: '1em',
                },
                '&.MuiInputLabel-shrink': {
                    padding: '0 8px',
                    marginLeft: -6,
                    lineHeight: '1.4375em',
                },
            },
        },
    },
});
