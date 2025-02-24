import React from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '../../Input';
import { FormInputTextField } from '../type';

export const InputForm: React.ForwardRefExoticComponent<Omit<FormInputTextField, 'ref'>> =
    React.forwardRef(({ ...props }, ref) => {
        const { name, defaultValue, ...rest } = props;

        const {
            setValue,
            control,
            formState: { errors },
        } = useFormContext();
        const error = errors[name];

        const onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            const { value } = event.target;
            setValue(name, value, { shouldValidate: true, shouldDirty: true });
        };

        return (
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue || ''}
                render={({ field }) => (
                    <Input
                        {...field}
                        {...rest}
                        ref={ref}
                        onChange={onChange}
                        error={error?.message as string}
                    />
                )}
            />
        );
    });
