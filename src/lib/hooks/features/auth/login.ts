import React from 'react';

import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import { useEncryption, useFormHandler, useLocalStorage, useTranslation } from '@/lib/hooks';
import { login } from '@/lib/serviceCallApi/Login';
import { z } from 'validate';

interface LoginForm {
    username: string;
    password: string;
}

export const useLogin = () => {
    const t = useTranslation(['common', 'auth']);
    const navigate = useNavigate();

    const [isRemember, setIsRemember] = React.useState<boolean>(false);

    const [loginForm, setLoginForm] = React.useState<LoginForm>({ username: '', password: '' });
    const [remember, setRemember, removeRemember] = useLocalStorage<string>('rememberMe', 'false');
    const { encrypt, decrypt } = useEncryption();

    const formStructure: FormInputGenericProps[] = [
        {
            label: t('username'),
            name: 'username',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().required(),
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

    const onSubmit = async (values: LoginForm) => {
        console.log('values', values);

        try {
            const result = await login(values);

            if (!result?.accessToken) {
                console.error('Missing accessToken in response');
                return;
            }

            if (!result?.role) {
                console.error('Missing role in response');
                return;
            }
            if (isRemember) {
                const passwordEncrypt = encrypt(values.password);
                setLoginForm({ username: values.username, password: passwordEncrypt });
                localStorage.setItem('username', values.username);
                setRemember('true');
                localStorage.setItem('authToken', result.accessToken);
                localStorage.setItem('username', values.username);
                localStorage.setItem('id', values.username);
            } else {
                setLoginForm({ username: '', password: '' });
                localStorage.setItem('username', values.username);
                removeRemember();
                localStorage.setItem('authToken', result.accessToken);
                localStorage.setItem('username', values.username);
                localStorage.setItem('id', values.username);
            }

            setTimeout(() => {
                navigate(result.role === 'admin' ? '/dashboard' : '/customers/homepage');
            }, 500);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    React.useEffect(() => {
        if (remember === 'true') {
            setIsRemember(true);
            const storedUsername = localStorage.getItem('username') || '';
            const passwordDecrypt = loginForm.password ? decrypt(loginForm.password) : '';
            reset({
                username: storedUsername,
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
