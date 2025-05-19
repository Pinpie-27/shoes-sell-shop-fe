import React from 'react';

import { Box, Button, Card, CardContent, CardMedia, Divider, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Inventory = {
    product_id: number;
    product_name: string;
    selling_price: number;
    category_name: string;
    style_name: string;
    productColor: string;
    image?: string;
};

type Props = {
    product: Inventory;
};

const ProductCard: React.FC<Props> = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/customers/product/${product.product_id}`);
    };

    return (
        <Card
            sx={{
                maxWidth: 300,
                minHeight: 450,
                maxHeight: 450,
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                '&:hover .buy-now-btn': {
                    opacity: 1,
                    transform: 'translate(-50%, -50%) scale(1)',
                },
            }}
            onClick={handleClick}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={product.image}
                    alt={product.category_name}
                />
                <Button
                    className="buy-now-btn"
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(0.8)',
                        opacity: 0,
                        transition: 'all 0.3s ease-in-out',
                        backgroundColor: 'var(--color-primary-main)',
                        color: 'white',
                        zIndex: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                    }}
                >
                    Mua ngay
                </Button>
            </Box>
            <Divider
                sx={{
                    borderStyle: 'dashed',
                    borderColor: 'grey.500',
                    borderWidth: '1px 0 0 0',
                }}
            />
            <CardContent>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                        color: 'black',
                        fontSize: '16px',
                        cursor: 'pointer',
                        '&:hover': {
                            color: 'var(--color-primary-main)',
                        },
                    }}
                >
                    {product.product_name} - {product.category_name} - {product.style_name}
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ color: 'black', fontSize: '16px', mt: 1.5, fontWeight: 'normal' }}
                >
                    {product.productColor}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: 'black', fontSize: '18px', mt: 2, fontWeight: 'bold' }}
                >
                    {Number(product.selling_price).toLocaleString()} VNĐ
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
