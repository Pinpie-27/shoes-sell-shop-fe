import React from 'react';

import { SelectChangeEvent } from '@mui/material/Select';
import { Controller, useFormContext } from 'react-hook-form';

import { CustomSelect } from '../../Select';
import { FormSelectField } from '../type';

export const SelectForm: React.ForwardRefExoticComponent<Omit<FormSelectField, 'ref'>> =
    React.forwardRef(({ ...props }, ref) => {
        const { name, defaultValue, ...rest } = props;

        const {
            setValue,
            control,
            formState: { errors },
        } = useFormContext();
        const error = errors[name];

        const onChange = (event: SelectChangeEvent<unknown>) => {
            const { value } = event.target;
            setValue(name, value, { shouldValidate: true, shouldDirty: true });
        };

        return (
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue || ''}
                render={({ field }) => (
                    <CustomSelect
                        {...field}
                        {...rest}
                        ref={ref}
                        onChange={onChange}
                        label={typeof rest.label === 'string' ? rest.label : undefined}
                        error={error?.message as string}
                    />
                )}
            />
        );
    });
