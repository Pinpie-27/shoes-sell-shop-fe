import { Box } from '@mui/material';
import tw, { styled, TwStyle } from 'twin.macro';

export const FormWrapper = styled(Box)<{ invisible?: boolean; spacing?: TwStyle }>(
    ({ invisible, spacing }) => [tw`grid`, spacing, invisible && tw`invisible`]
);

export const Col = styled.div<{
    colSpan: TwStyle;
}>(({ colSpan }) => [colSpan]);
