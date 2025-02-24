import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import { useFormHandler, useTranslation } from '@/lib/hooks';
import { z } from 'validate';

interface ForgotPasswordForm {
    email: string;
}

export const useForgotPassword = () => {
    const t = useTranslation(['common', 'auth']);

    const formStructure: FormInputGenericProps[] = [
        {
            label: t('email'),
            name: 'email',
            inputType: 'TextField',
            colSpan: tw`col-span-12`,
            validate: z.string().required().email(),
            placeholder: t('enter-your-email'),
        },
    ];

    const { formHandler } = useFormHandler<ForgotPasswordForm>(formStructure);
    const { handleSubmit } = formHandler;

    const onSubmit = (values: ForgotPasswordForm) => {
        console.log('values', values);
    };

    return {
        formHandler,
        formStructure,
        onSubmit: handleSubmit(onSubmit),
    };
};
