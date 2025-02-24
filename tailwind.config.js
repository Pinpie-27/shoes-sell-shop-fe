/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', 'index.html'],

    theme: {
        extend : {
            colors: {
                primary: {
                    light: 'var(--color-primary-light)',
                    main: 'var(--color-primary-main)',
                    dark: 'var(--color-primary-dark)',
                },
                secondary: {
                    light: 'var(--color-secondary-light)',
                    main: 'var(--color-secondary-main)',
                    dark: 'var(--color-secondary-dark)',
                },
                textColor: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    tertiary: 'var(--color-text-tertiary)',
                    disabled: 'var(--color-text-disabled)',
                },
                black: 'var(--color-black)',
                white: 'var(--color-white)',
                layoutInput: 'var(--color-layout-input)',
                action: {
                    disabled:'var(--color-action-disabled)'
                },
                divider: 'var(--color-divider)',
                bg: {
                    // default: 'var(--color-bg-default)',
                    paper: 'var(--color-bg-paper)',
                }
            }
            
        },

        fontFamily: {
            primary: 'var(--font-family-primary)',
        },

        screens: {
            xs: '0px',
            sm: '768px',
            md: '1024px',
            lg: '1266px',
            xl: '1536px',
        },
    },
    variants: {
        extend: {
            display: ['group-hover'],
            backgroundColor: ['hover', 'focus'],
            backgroundOpacity: ['hover', 'focus'],
        },
    },
    plugins: [
        plugin(
            function ({ matchUtilities, addUtilities, theme, variants }) {
                const values = theme('lineClamp');
                matchUtilities(
                    {
                        'line-clamp': (value) => ({
                            overflow: 'hidden',
                            display: '-webkit-box',
                            '-webkit-box-orient': 'vertical',
                            '-webkit-line-clamp': `${value}`,
                        }),
                    },
                    { values }
                );
                addUtilities(
                    [
                        {
                            '.line-clamp-none': {
                                '-webkit-line-clamp': 'unset',
                            },
                        },
                    ],
                    variants('lineClamp')
                );
                const newUtilities = {
                    '.all-unset': {
                        all: 'unset',
                    },
                };
                addUtilities(newUtilities);
            },
            {
                theme: {
                    lineClamp: {
                        1: '1',
                        2: '2',
                        3: '3',
                        4: '4',
                        5: '5',
                        6: '6',
                    },
                },
                variants: {
                    lineClamp: ['responsive'],
                },
            }
        ),
    ],
};
