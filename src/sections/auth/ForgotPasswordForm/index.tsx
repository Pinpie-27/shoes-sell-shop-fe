import React from 'react';

import { Box, Button, Typography } from '@mui/material';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useTranslation } from '@/lib/hooks';
import { useForgotPassword } from '@/lib/hooks/features';

export const ForgotPasswordForm: React.FC = () => {
    const t = useTranslation();

    const { formHandler, formStructure, onSubmit } = useForgotPassword();

    return (
        <form tw="flex flex-col gap-8 mt-8" onSubmit={onSubmit}>
            <FieldGroup
                formHandler={formHandler}
                formStructure={formStructure}
                spacing={tw`gap-4`}
            />
            <Box tw="flex flex-col gap-4">
                <Typography tw="text-black" variant="caption">
                    {t('auth.do-not-forgot-to-check-spam-box')}
                </Typography>
                <Button variant="contained" type="submit">
                    {t('auth.send-password-reset-email')}
                </Button>
            </Box>
        </form>
    );
};
