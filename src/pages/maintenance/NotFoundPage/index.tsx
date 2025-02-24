import React from 'react';

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import error404 from '@/assets/images/Error404.png';
import TwoCone from '@/assets/images/TwoCone.png';
import { Img } from '@/components/Elements';

const NotFoundPage: React.FC = () => (
    <>
        <Grid
            container
            spacing={10}
            tw="min-h-screen pb-4 pt-6 overflow-hidden justify-center items-center flex-col"
        >
            <Grid item xs={12}>
                <Stack direction="row">
                    <Grid item>
                        <Box tw="md:(w-[590px] h-[300px]) w-[250px] h-[130px]">
                            <Img src={error404} alt="" tw="w-full h-full" />
                        </Box>
                    </Grid>
                    <Grid item sx={{ position: 'relative' }} tw="relative">
                        <Box
                            tw="absolute top-[60px] left-[-40px] w-[130px] 
                        h-[115px] w-[130px] h-[115px] md:(w-[390px] h-[330px])"
                        >
                            <Img src={TwoCone} alt="" tw="w-full h-full" />
                        </Box>
                    </Grid>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={2} justifyContent="center" alignItems="center">
                    <Typography variant="h1">Page Not Found</Typography>
                    <Typography
                        color="textSecondary"
                        align="center"
                        sx={{ width: { xs: '73%', sm: '61%' } }}
                    >
                        The page you are looking was moved, removed, renamed, or might never exist!
                    </Typography>
                    <Button component={Link} to={'/'} variant="contained">
                        Back To Home
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    </>
);

export default NotFoundPage;
