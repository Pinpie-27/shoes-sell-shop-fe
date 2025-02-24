import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';

import { FormInputGenericProps } from '@/components/interactive';

import { Refine, useSchema } from './useSchema';

type Mode = 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';

interface UseFormHandlerOption<Type> {
    mode?: Mode;
    schemaRefine?: Refine<Type>;
}

export const useFormHandler = <Type extends FieldValues>(
    initialFormStructure: FormInputGenericProps[],
    option?: UseFormHandlerOption<Type>
) => {
    const [formStructure, setFormStructure] =
        React.useState<FormInputGenericProps[]>(initialFormStructure);
    const schema = useSchema<Type>(formStructure, option?.schemaRefine as any);
    const formHandler = useForm<Type>({
        mode: option?.mode || 'onChange',
        resolver: zodResolver(schema) as any,
    });

    return { formHandler, formStructure, setFormStructure };
};
