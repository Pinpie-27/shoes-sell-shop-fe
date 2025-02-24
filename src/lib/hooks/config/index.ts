import { useAtom } from 'jotai';

import { PROJECT_CONFIG_KEY } from '@/constants';
import { ConfigGlobal } from '@/lib/configs';
import { configAtom } from '@/lib/states/common';

import { useLocalStorage } from '../common';

export const useConfig = () => {
    const [config, setConfig] = useAtom(configAtom);
    const [configInLocalStorage, setConfigInLocalStorage] = useLocalStorage<ConfigGlobal>(
        PROJECT_CONFIG_KEY,
        config
    );

    const onSetTheme = (theme: ConfigGlobal['theme']) => {
        setConfig({ ...config, theme });
        setConfigInLocalStorage({ ...configInLocalStorage, theme });
    };

    const onSetMode = (mode: ConfigGlobal['mode']) => {
        setConfig({ ...config, mode });
        setConfigInLocalStorage({ ...configInLocalStorage, mode });
    };

    return { ...config, onSetTheme, onSetMode };
};
