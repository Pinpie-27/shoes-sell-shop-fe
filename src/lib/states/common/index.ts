import { atom } from 'jotai';

import { configGlobal, ConfigGlobal } from '@/lib/configs';

export const configAtom = atom<ConfigGlobal>(configGlobal);

interface NotificationGlobal {
    variant: 'success' | 'error' | 'warning' | 'info';
    autoHideDuration?: number;
    message: string;
}

export const notificationAtom = atom<NotificationGlobal[]>([]);
