import { Box, Typography } from '@mui/material';

import { useGetProducts } from '@/lib/hooks/features';
import { useGetOrderItems } from '@/lib/hooks/features/orderItems';

export const OrderDetailPage = () => {
    const { data, isLoading, isError } = useGetOrderItems();
    const { data: products } = useGetProducts();

    if (isLoading) return <Typography>Loading order details...</Typography>;
    if (isError) return <Typography>Error loading order details.</Typography>;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={3} color="black">
                Order Details
            </Typography>

            {data.map((item: any) => {
                const product = products?.find((p: any) => p.id === item.product_id);
                return (
                    <Box
                        key={item.id}
                        sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}
                    >
                        <Typography color="black" fontSize={20} fontWeight={600}>
                            Product: {product?.name || ''}
                        </Typography>
                        <Typography color="black">Quantity: {item.quantity}</Typography>
                        <Typography color="black">
                            Total: {Number(item.price).toLocaleString()} VNĐ
                        </Typography>
                        <Typography color="black">Status: {item.status}</Typography>
                    </Box>
                );
            })}
        </Box>
    );
};
