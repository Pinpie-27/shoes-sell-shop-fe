import React from 'react';

import { IntlProvider } from 'react-intl';

import { useConfig } from '@/lib/hooks/config';
import { flattenObject } from '@/lib/utils';

const loadLocaleData = (locale: string) => {
    switch (locale) {
        case 'en':
            return import('@/lib/locales/en.json');
        case 'vi':
            return import('@/lib/locales/vi.json');
        default:
            return import('@/lib/locales/vi.json');
    }
};

export const LocaleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { i18n } = useConfig();

    const [messages, setMessages] = React.useState({});

    React.useEffect(() => {
        loadLocaleData(i18n).then((d) => {
            setMessages(flattenObject(d.default));
        });
    }, [i18n]);

    return (
        <>
            {messages && (
                <IntlProvider locale={i18n} defaultLocale={i18n} messages={messages}>
                    {children}
                </IntlProvider>
            )}
        </>
    );
};
