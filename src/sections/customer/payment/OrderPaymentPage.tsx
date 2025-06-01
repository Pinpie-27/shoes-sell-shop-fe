import { useEffect, useState } from 'react';

import { Box, Paper, Typography } from '@mui/material';
import QRCode from 'react-qr-code';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const OrderPaymentPage = ({
    paymentUrl,
    amount,
}: {
    paymentUrl: string;
    amount?: number;
}) => {
    const [isPaid, setIsPaid] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // Lấy orderId từ query hoặc props, tuỳ bạn truyền vào
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (!orderId) return;
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/orders/${orderId}`);
                const data = await res.json();
                if (data.status === 'PAID') {
                    setIsPaid(true);
                    clearInterval(interval);
                }
            } catch (err) {
                // Có thể log lỗi nếu cần
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [orderId]);

    useEffect(() => {
        if (isPaid && orderId) {
            navigate(`/customers/order-success?orderId=${orderId}`);
        }
    }, [isPaid, orderId, navigate]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 5,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: 400,
                    width: '100%',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    background: 'rgba(255,255,255,0.95)',
                }}
            >
                <Typography
                    variant="h5"
                    mb={2}
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        letterSpacing: 1,
                    }}
                >
                    Quét mã QR để thanh toán với VNPAY
                </Typography>
                <Box
                    sx={{
                        background: '#fff',
                        p: 2,
                        borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        mb: 2,
                    }}
                >
                    <QRCode value={paymentUrl} size={220} />
                </Box>
                {amount && (
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#0ea5e9',
                            fontWeight: 600,
                            mb: 1,
                        }}
                    >
                        Số tiền: {amount.toLocaleString()} VND
                    </Typography>
                )}
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: 16,
                        mt: 1,
                    }}
                >
                    Sau khi thanh toán thành công, vui lòng chờ xác nhận đơn hàng.
                </Typography>
            </Paper>
        </Box>
    );
};
