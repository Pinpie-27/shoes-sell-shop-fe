import React from 'react';

import CryptoJS from 'crypto-js';

import { ENCRYPTION_SECRET_KEY } from '@/constants';

export const useEncryption = () => {
    const encrypt = React.useCallback(
        (data: string) => CryptoJS.AES.encrypt(data, ENCRYPTION_SECRET_KEY).toString(),
        []
    );

    const decrypt = React.useCallback((cipherText: string) => {
        const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }, []);

    return { encrypt, decrypt };
};
