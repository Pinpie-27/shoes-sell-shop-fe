import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { z } from 'zod';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

import { useFormHandler, useTranslation } from '../../common';

interface SignupForm {
    username: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

export const createAccount = async (newAccount: SignupForm) => {
    const response = await axiosClient.post(`/register`, newAccount);
    return response.data;
};

export const useSignup = () => {
    const t = useTranslation(['common', 'auth']);
    const queryClient = useQueryClient();

    const createAccountMutation = useMutation({
        mutationFn: createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['color-Variants'] });
            toast.success(`Account created successfully`);
        },
        onError: () => {
            toast.error('Failed to create account');
        },
    });

    const formStructure: FormInputGenericProps[] = [
        {
            label: t('username'),
            name: 'username',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().min(1, { message: t('required-field') }),
            placeholder: t('enter-your-username'),
        },
        {
            label: t('email'),
            name: 'email',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z
                .string()
                .min(1, { message: t('required-field') })
                .email(),
            placeholder: t('enter-your-email'),
        },
        {
            label: t('password'),
            name: 'password',
            type: 'password',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().min(1, { message: t('required-field') }),
            placeholder: t('enter-your-password'),
        },
        {
            label: t('phone'),
            name: 'phone',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().min(1, { message: t('required-field') }),
            placeholder: t('enter-your-phone'),
        },
        {
            label: t('address'),
            name: 'address',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().min(1, { message: t('required-field') }),
            placeholder: t('enter-your-address'),
        },
    ];

    const { formHandler } = useFormHandler<SignupForm>(formStructure);
    const { handleSubmit } = formHandler;

    const onSubmit = (values: SignupForm) => {
        createAccountMutation.mutate(values);
    };

    return {
        formHandler,
        formStructure,
        onSubmit: handleSubmit(onSubmit),
    };
};
