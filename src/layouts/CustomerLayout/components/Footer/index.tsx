import React from 'react';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Divider, IconButton, Typography } from '@mui/material';

export const Footer: React.FC = () => (
    <Box component="footer" sx={{ bgcolor: '#2c2c2c', color: '#ddd', mt: 8, pt: 6, pb: 4 }}>
        <Box
            sx={{
                maxWidth: '1200px',
                mx: 'auto',
                px: 3,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                gap: 4,
            }}
        >
            <Box sx={{ flex: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    ANANAS
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                    Thương hiệu giày dép hàng đầu Việt Nam, luôn đồng hành cùng bạn trong mọi bước
                    chân. Chất lượng – Phong cách – Cá tính.
                </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    KẾT NỐI VỚI CHÚNG TÔI
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                    <IconButton
                        href="#"
                        color="inherit"
                        aria-label="Facebook"
                        sx={{ color: '#ddd' }}
                    >
                        <FacebookIcon />
                    </IconButton>
                    <IconButton
                        href="#"
                        color="inherit"
                        aria-label="Instagram"
                        sx={{ color: '#ddd' }}
                    >
                        <InstagramIcon />
                    </IconButton>
                    <IconButton
                        href="#"
                        color="inherit"
                        aria-label="YouTube"
                        sx={{ color: '#ddd' }}
                    >
                        <YouTubeIcon />
                    </IconButton>
                </Box>

                <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                    Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
                    <br />
                    Hotline: 1900 1234
                    <br />
                    Email: support@ananas.vn
                </Typography>
            </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: '#333' }} />

        <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', opacity: 0.6 }}>
            © 2025 Ananas. All rights reserved.
        </Typography>
    </Box>
);
