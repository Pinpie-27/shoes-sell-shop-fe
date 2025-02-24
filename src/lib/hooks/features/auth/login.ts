import React from 'react';

import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import { useEncryption, useFormHandler, useLocalStorage, useTranslation } from '@/lib/hooks';
import { z } from 'validate';

interface LoginForm {
    username: string;
    password: string;
}

export const useLogin = () => {
    const t = useTranslation(['common', 'auth']);

    const [isRemember, setIsRemember] = React.useState<boolean>(false);

    const [username, setUsername, removeUsername] = useLocalStorage<string>('username', '');
    const [password, setPassword, removePassword] = useLocalStorage<string>('password', '');
    const [remember, setRemember, removeRemember] = useLocalStorage<string>('rememberMe', 'false');
    const { encrypt, decrypt } = useEncryption();

    const formStructure: FormInputGenericProps[] = [
        {
            label: t('username'),
            name: 'username',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().required().email(),
            placeholder: t('enter-your-username'),
        },
        {
            label: t('password'),
            name: 'password',
            type: 'password',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().required(),
            placeholder: t('enter-your-password'),
        },
    ];

    const { formHandler } = useFormHandler<LoginForm>(formStructure);

    const { handleSubmit, reset } = formHandler;

    const onSubmit = (values: LoginForm) => {
        console.log('values', values);

        if (isRemember) {
            const passwordEncrypt = encrypt(values.password);
            setUsername(values.username);
            setPassword(passwordEncrypt);
            setRemember('true');
        } else {
            removeUsername();
            removePassword();
            removeRemember();
        }
    };

    React.useEffect(() => {
        if (remember === 'true') {
            setIsRemember(true);
            const passwordDecrypt = password ? decrypt(password) : '';
            reset({
                username: username || '',
                password: passwordDecrypt,
            });
        }
    }, []);

    return {
        formHandler,
        formStructure,
        onSubmit: handleSubmit(onSubmit),
        isRemember,
        setIsRemember,
    };
};
