import { ThemeMode } from '../utils';

export interface ConfigGlobal {
    defaultPath: string;
    fontFamily: string;
    i18n: string;
    mode: ThemeMode;
    theme: string;
}

export const configGlobal: ConfigGlobal = {
    defaultPath: '',
    fontFamily: `'Public Sans', sans-serif`,
    i18n: 'en',
    mode: ThemeMode.Dark,
    theme: 'default',
};
