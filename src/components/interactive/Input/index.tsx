import React from 'react';

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import SearchIcon from '@mui/icons-material/Search';
import {
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    OutlinedInputProps,
    Stack,
} from '@mui/material';

export interface InputProps extends Omit<OutlinedInputProps, 'error'> {
    error?: string;
    id?: string;
}

export const Input: React.FC<InputProps> = (props) => {
    const { error, id, type, name, placeholder, label, endAdornment, ...rest } = props;

    const idComponent = React.useId();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const typeInput = showPassword ? 'text' : type;

    return (
        <Stack spacing={1}>
            {label && (
                <InputLabel tw="text-black!" htmlFor={id || idComponent}>
                    {label}
                </InputLabel>
            )}
            <OutlinedInput
                {...rest}
                id={id || idComponent}
                type={typeInput}
                name={name}
                placeholder={placeholder}
                fullWidth
                autoComplete=""
                error={!!error}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'layoutInput',
                    },
                    '& .MuiInputBase-input': {
                        color: 'black',
                    },
                    '&.Mui-disabled .MuiInputBase-input': {
                        color: 'gray',
                        WebkitTextFillColor: 'gray',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--color-primary-main)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--color-primary-dark)',
                    },
                }}
                startAdornment={
                    type === 'search' && (
                        <InputAdornment position="start" sx={{ marginLeft: 0.5 }}>
                            <SearchIcon sx={{ color: 'black' }} />
                        </InputAdornment>
                    )
                }
                endAdornment={
                    endAdornment ||
                    (type === 'password' && (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={(e) => e.stopPropagation()}
                                color="secondary"
                            >
                                {!showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                        </InputAdornment>
                    ))
                }
            />
            {error && (
                <FormHelperText error tw="ml-2!">
                    {error}
                </FormHelperText>
            )}
        </Stack>
    );
};
