import React from 'react';

import {
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectProps,
    Stack,
} from '@mui/material';

export interface CustomSelectProps extends Omit<SelectProps, 'error'> {
    error?: string;
    label?: string;
    placeholder?: string;
    options?: { label: string; value: any }[];
    id?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = (props) => {
    const { error, id, name, label, value, onChange, placeholder, options = [], ...rest } = props;

    const idComponent = React.useId();

    return (
        <Stack spacing={1}>
            {label && (
                <InputLabel tw="text-black!" htmlFor={id || idComponent}>
                    {label}
                </InputLabel>
            )}

            <Select
                {...rest}
                id={id || idComponent}
                name={name}
                value={value}
                onChange={onChange}
                displayEmpty
                fullWidth
                input={<OutlinedInput notched label={label} />}
                error={!!error}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'layoutInput',
                    },
                    '& .MuiSelect-select': {
                        color: 'black',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--color-primary-main)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--color-primary-dark)',
                    },
                    '& .MuiSelect-icon': {
                        color: 'black',
                    },
                }}
            >
                <MenuItem value="" disabled sx={{ color: 'black' }}>
                    {placeholder || '-- Chọn --'}
                </MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ color: 'black' }}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>

            {error && (
                <FormHelperText error tw="ml-2!">
                    {error}
                </FormHelperText>
            )}
        </Stack>
    );
};
