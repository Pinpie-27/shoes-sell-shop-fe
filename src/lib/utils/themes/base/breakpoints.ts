import { theme as tailwindTheme } from 'twin.macro';

import { pxToNumber } from '../function';

export const breakpoints = {
    values: {
        xs: 0,
        sm: pxToNumber(tailwindTheme`screens.sm`),
        md: pxToNumber(tailwindTheme`screens.md`),
        lg: pxToNumber(tailwindTheme`screens.lg`),
        xl: pxToNumber(tailwindTheme`screens.xl`),
    },
};
