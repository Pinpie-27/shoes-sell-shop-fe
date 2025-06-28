import React, { useEffect, useState } from 'react';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Zoom } from '@mui/material';

const ScrollToTopButton: React.FC = () => {
    const [visible, setVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Zoom in={visible}>
            <Fab
                onClick={scrollToTop}
                size="medium"
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 25,
                    right: 80,
                    bgcolor: '#FFA726',
                    color: '#fff',
                    '&:hover': {
                        bgcolor: '#FB8C00',
                    },
                    boxShadow: 4,
                }}
                aria-label="scroll back to top"
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
};

export default ScrollToTopButton;
