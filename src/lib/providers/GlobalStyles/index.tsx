import React from 'react';

import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material';
import { createGlobalStyle } from 'styled-components';
import tw, { GlobalStyles as BaseStyles, theme as tailwindTheme } from 'twin.macro';

import { useConfig } from '@/lib/hooks/config';
//import { ThemeMode } from '@/lib/utils';
import {
    breakpoints,
    componentsOverrides,
    getCSSVariableValue,
    Typography,
} from '@/lib/utils/themes';

const CustomStyles = createGlobalStyle`
        body {
            ${tw`font-primary m-0 p-0 text-[0.875rem] text-textColor-primary`};
        }
    `;

export const GlobalStyles: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { mode } = useConfig();

    const themes: Theme = React.useMemo(
        () =>
            createTheme({
                breakpoints: { ...breakpoints },
                mixins: {
                    toolbar: {
                        minHeight: 60,
                        paddingTop: 8,
                        paddingBottom: 8,
                    },
                },
                typography: Typography(getCSSVariableValue(tailwindTheme`fontFamily.primary`)),
                palette: {
                    mode,
                    divider: getCSSVariableValue(tailwindTheme`colors.divider`),
                    background: {
                        // default: getCSSVariableValue(tailwindTheme`colors.bg.default`),
                        paper: getCSSVariableValue(tailwindTheme`colors.bg.paper`),
                    },
                    common: {
                        black: getCSSVariableValue(tailwindTheme`colors.black`),
                        white: getCSSVariableValue(tailwindTheme`colors.white`),
                    },
                    primary: {
                        dark: getCSSVariableValue(tailwindTheme`colors.primary.dark`),
                        light: getCSSVariableValue(tailwindTheme`colors.primary.light`),
                        main: getCSSVariableValue(tailwindTheme`colors.primary.main`),
                    },
                    secondary: {
                        light: getCSSVariableValue(tailwindTheme`colors.secondary.light`),
                        main: getCSSVariableValue(tailwindTheme`colors.secondary.main`),
                        dark: getCSSVariableValue(tailwindTheme`colors.secondary.dark`),
                    },
                    text: {
                        disabled: getCSSVariableValue(tailwindTheme`colors.textColor.disabled`),
                        primary: getCSSVariableValue(tailwindTheme`colors.textColor.primary`),
                        secondary: getCSSVariableValue(tailwindTheme`colors.textColor.secondary`),
                    },
                    action: {
                        disabled: getCSSVariableValue(tailwindTheme`colors.action.disabled`),
                    },
                },
            }),
        [mode]
    );

    themes.components = componentsOverrides(themes);

    // const rootColor = {
    //     '--color-black': '#000000',
    //     '--color-white': '#ffffff',
    //     '--color-primary-light': mode === ThemeMode.Dark ? '#164c7e' : '#69c0ff',
    //     '--color-primary-main': mode === ThemeMode.Dark ? '#177ddc' : '#1890ff',
    //     '--color-primary-dark': mode === ThemeMode.Dark ? '#3c9ae8' : '#096dd9',
    //     '--color-secondary-light': mode === ThemeMode.Dark ? '#8c8c8c' : '#d9d9d9',
    //     '--color-secondary-main': mode === ThemeMode.Dark ? '#d9d9d9' : '#8c8c8c',
    //     '--color-secondary-dark': mode === ThemeMode.Dark ? '#f5f5f5' : '#262626',
    //     '--color-text-primary': mode === ThemeMode.Dark ? 'rgba(255, 255, 255, 0.87)' : '#262626',
    //     '--color-text-secondary': mode === ThemeMode.Dark ? 'rgba(255, 255, 255, 0.45)' : '#8c8c8c',
    //     '--color-text-disabled': mode === ThemeMode.Dark ? 'rgba(255, 255, 255, 0.1)' : '#bfbfbf',
    //     '--color-action-disabled': mode === ThemeMode.Dark ? '#8c8c8c' : '#d9d9d9',
    //     '--color-divider': mode === ThemeMode.Dark ? 'rgba(255, 255, 255, 0.05)' : '#f0f0f0',
    //     '--color-bg-default': mode === ThemeMode.Dark ? '#121212' : '#fafafb',
    //     '--color-bg-paper': mode === ThemeMode.Dark ? '#1e1e1e' : '#ffffff',
    // };
    // Object.entries(rootColor).map(([key, value]) => {
    //     document.documentElement.style.setProperty(key, value);
    // });

    return (
        <StyledEngineProvider>
            <ThemeProvider theme={themes}>
                <BaseStyles />
                <CustomStyles />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
};
