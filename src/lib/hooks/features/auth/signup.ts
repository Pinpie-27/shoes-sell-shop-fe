import tw from "twin.macro";
import { z } from "zod";

import { FormInputGenericProps } from "@/components/interactive";

import { useFormHandler, useTranslation } from "../../common";



interface SignupForm{
    username: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

export const useSignup = () => {
    const t = useTranslation(['common', 'auth']);
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
            label: t('email'),
            name: 'email',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().required().email(),
            placeholder: t('enter-your-email'),
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
        {
            label: t('phone'),
            name: 'phone',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().required(),
            placeholder: t('enter-your-phone'),
        },
        {
            label: t('address'),
            name: 'address',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().required(),
            placeholder: t('enter-your-address'),
        },
    ]

    const { formHandler } = useFormHandler<SignupForm>(formStructure);

    const { handleSubmit} = formHandler;

    const onSubmit = (values: SignupForm) => {
        console.log('values', values);
    };

    return{
        formHandler,
        formStructure,
        onSubmit: handleSubmit(onSubmit),
    }
}