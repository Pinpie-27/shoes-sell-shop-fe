import { useIntl } from 'react-intl';

export const useTranslation = (namespace?: string | string[]) => {
    const intl = useIntl();

    const t = (key: string, values: Record<string, string> = {}) => {
        if (!namespace) return intl.formatMessage({ id: key }, values);

        const namespaces = window._.isArray(namespace) ? namespace : [namespace];

        for (const ns of namespaces) {
            const fullKey = `${ns}.${key}`;
            if (intl.messages[fullKey]) {
                return intl.formatMessage({ id: fullKey }, values);
            }
        }

        return intl.formatMessage({ id: key }, values);
    };

    return t;
};
