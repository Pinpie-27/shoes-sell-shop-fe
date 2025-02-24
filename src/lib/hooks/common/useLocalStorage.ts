import React from 'react';

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
    const [value, setValue] = React.useState(() => {
        const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        return storedValue === null ? defaultValue : JSON.parse(storedValue);
    });

    React.useEffect(() => {
        const listener = (e: any) => {
            if (typeof window !== 'undefined' && e.storageArea === localStorage && e.key === key) {
                setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
            }
        };
        window.addEventListener('storage', listener);

        return () => {
            window.removeEventListener('storage', listener);
        };
    }, [key, defaultValue]);

    const setValueInLocalStorage = (newValue: T) => {
        setValue((currentValue: T) => {
            const result = typeof newValue === 'function' ? newValue(currentValue) : newValue;
            if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(result));
            return result;
        });
    };

    const removeItem = React.useCallback(() => {
        try {
            localStorage.removeItem(key);
            setValue(defaultValue);
        } catch (error) {
            console.error('Error removing localStorage', error);
        }
    }, [key, defaultValue]);

    return [value, setValueInLocalStorage, removeItem];
};
