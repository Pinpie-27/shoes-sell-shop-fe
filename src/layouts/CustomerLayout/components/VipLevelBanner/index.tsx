import React from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Typography } from '@mui/material';

import { useGetVipLevels } from '@/lib/hooks/features';

export const VipLevelBanner: React.FC = () => {
    const { data: vipLevels, isLoading, error } = useGetVipLevels();
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        if (!vipLevels || vipLevels.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === vipLevels.length - 1 ? 0 : prev + 1));
        }, 1400);

        return () => clearInterval(interval);
    }, [vipLevels]);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error || !vipLevels || vipLevels.length === 0) return <Typography>No data</Typography>;

    const currentVip = vipLevels[currentIndex];

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? vipLevels.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === vipLevels.length - 1 ? 0 : prev + 1));
    };

    return (
        <Box
            sx={{
                bgcolor: '#4a4a4a',
                height: 50,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                px: 3,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: 1,
            }}
        >
            <IconButton
                aria-label="previous"
                onClick={handlePrev}
                sx={{ color: 'grey.500', fontSize: '1.25rem', '&:hover': { color: 'black' } }}
            >
                <ChevronLeftIcon />
            </IconButton>

            <Typography
                variant="body1"
                component="div"
                sx={{ flexGrow: 1, textAlign: 'center', color: 'white' }}
            >
                Level {currentVip.level_name} – xài {currentVip.min_spend} mới đã, ưu đãi{' '}
                {currentVip.discount_rate}% đây!
            </Typography>

            <IconButton
                aria-label="next"
                onClick={handleNext}
                sx={{ color: 'grey.500', fontSize: '1.25rem', '&:hover': { color: 'black' } }}
            >
                <ChevronRightIcon />
            </IconButton>
        </Box>
    );
};
