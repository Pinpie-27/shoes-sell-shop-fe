import * as z from 'zod';

import { FormInputGenericProps } from '@/components/interactive';

export interface Refine<Type> {
    check: (_: Type) => any;
    message?: string | z.CustomErrorParams | ((_: Type) => z.CustomErrorParams);
}

export const useSchema = <Type>(formStructure: FormInputGenericProps[], refine: Refine<Type>) => {
    const schema = formStructure.reduce(
        (acc, field) => ({
            ...acc,
            [field.name]: field.validate,
        }),
        {}
    );

    return refine
        ? z.object(schema).refine(refine.check as any, refine.message as any)
        : z.object(schema);
};
