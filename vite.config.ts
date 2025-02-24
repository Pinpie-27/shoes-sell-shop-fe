import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(() => {
    return {
        server: {
            port: 3001,
        },
        resolve: {
            alias: [
                { find: 'types', replacement: path.join(__dirname, '/src/lib/interface') },
                { find: 'validate', replacement: path.join(__dirname, '/src/lib/utils/zod') },
                { find: '@', replacement: path.join(__dirname, '/src') },
            ],
        },
        plugins: [
            react({
                babel: {
                    presets: ['@babel/preset-react', '@babel/preset-typescript'],
                    plugins: [
                        'babel-plugin-twin',
                        'babel-plugin-macros',
                        'babel-plugin-styled-components',
                        [
                            'auto-import',
                            {
                                declarations: [{ default: 'React', path: 'react' }],
                            },
                        ],
                    ],
                },
            }),
            svgr(),
        ],
        optimizeDeps: {
            include: ['@emotion/react', '@emotion/styled'],
        },
    };
});
