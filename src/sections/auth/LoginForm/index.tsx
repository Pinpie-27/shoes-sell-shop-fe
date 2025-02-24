import React from 'react';

import { Button, Checkbox, FormControlLabel, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useTranslation } from '@/lib/hooks';
import { useLogin } from '@/lib/hooks/features';

export const LoginForm: React.FC = () => {
    const t = useTranslation();

    const { formHandler, formStructure, onSubmit, isRemember, setIsRemember } = useLogin();

    return (
        <form tw="flex flex-col gap-8 mt-8" onSubmit={onSubmit}>
            <FieldGroup
                formHandler={formHandler}
                formStructure={formStructure}
                spacing={tw`gap-4`}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isRemember}
                            onChange={(event) => setIsRemember(event.target.checked)}
                            name="checked"
                            color="primary"
                            size="small"
                        />
                    }
                    label={<Typography tw="text-black" variant="h6">Keep me sign in</Typography>}
                />
                <Link
                    variant="h6"
                    component={RouterLink}
                    to="/auth/forgot-password"
                    tw="text-black"
                >
                    Forgot Password?
                </Link>
            </Stack>
            <Button variant="contained" type="submit">
                {t('common.submit')}
            </Button>
        </form>
    );
};
