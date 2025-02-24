import React from 'react';

import { useAtomValue } from 'jotai';

import { PROJECT_CONFIG_KEY } from '@/constants';
import { useLocalStorage } from '@/lib/hooks/common';
import { configAtom } from '@/lib/states/common';

export const ConfigProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const config = useAtomValue(configAtom);

    const [] = useLocalStorage(PROJECT_CONFIG_KEY, config);

    return children;
};
