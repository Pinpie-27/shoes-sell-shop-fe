/* eslint-disable max-lines */
import React from 'react';

import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useGetCategories, useGetProducts, useGetReviews } from '@/lib/hooks/features';
import { useCreateCartItem } from '@/lib/hooks/features/cartItems';
import { useGetColorVariants } from '@/lib/hooks/features/colorVariants';
import { useGetInventory, useGetInventoryGroup } from '@/lib/hooks/features/inventory';
import { useGetProductColors } from '@/lib/hooks/features/product-colors/get-productColor';
import { useGetProductImages } from '@/lib/hooks/features/product-images';
import { useGetStyles } from '@/lib/hooks/features/styles/get-style';

import { Review } from '../../review/ReviewForm';
import { ReviewList } from '../../review/ReviewList';
import RelatedProducts from '../ProductRelated';

const ProductDetail = () => {
    const { id } = useParams();
    const productId = Number(id);
    const userId = Number(id);

    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
    const [quantity, setQuantity] = React.useState<number>(1);

    const {
        data: products = [],
        isLoading: loadingProducts,
        isError: errorProducts,
    } = useGetProducts();

    const {
        data: images = [],
        isLoading: loadingImages,
        isError: errorImages,
    } = useGetProductImages();

    const { data: sizes = [], isLoading: loadingSizes, isError: errorSizes } = useGetInventory();

    const {
        data: colorVariants = [],
        isLoading: loadingColorVariants,
        isError: errorColorVariants,
    } = useGetColorVariants();

    const {
        data: productColors,
        isLoading: loadingProductColor,
        isError: errorProductColor,
    } = useGetProductColors();

    const { data: styles, isLoading: loadingStyles, isError: errorStyles } = useGetStyles();
    const {
        data: categories,
        isLoading: loadingCategories,
        isError: errorCategories,
    } = useGetCategories();
    const { data: reviews = [] } = useGetReviews();

    const addToCart = useCreateCartItem();

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size before adding to cart');
            return;
        }

        if (!product || !inventoryForPrice) {
            toast.error('Invalid product information');
            return;
        }

        addToCart.mutate({
            product_id: productId,
            quantity,
            size: selectedSize,
            price: inventoryForPrice.selling_price,
        });
    };

    useGetInventoryGroup();

    const product = products.find((p: any) => p.id === productId);
    const productImages = images.filter((img: any) => img.product_id === productId);
    const productColorList = Array.isArray(productColors)
        ? productColors.filter((pColor: any) => pColor.product_id === productId)
        : [];

    const availableSizes = sizes
        .filter((inv: any) => inv.product_id === productId && inv.quantity > 0)
        .map((inv: any) => inv.size);

    const inventoryForPrice = sizes.find(
        (inv: any) => inv.product_id === productId && inv.quantity > 0
    );

    const selectedInventory = sizes.find(
        (inv: any) => inv.product_id === productId && inv.size === selectedSize
    );
    const maxQuantity = selectedInventory?.quantity ?? 1;

    React.useEffect(() => {
        setSelectedImage(null);
    }, [productId]);

    React.useEffect(() => {
        if (selectedImage === null && productImages.length > 0) {
            setSelectedImage(productImages[0].image_url);
        }
    }, [productImages, selectedImage]);

    const handleDecrease = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleIncrease = () => {
        if (quantity < maxQuantity) setQuantity((prev) => prev + 1);
    };

    if (
        loadingProducts ||
        loadingImages ||
        loadingSizes ||
        loadingColorVariants ||
        loadingProductColor ||
        loadingStyles ||
        loadingCategories
    ) {
        return <Typography>Loading...</Typography>;
    }

    if (
        errorProducts ||
        errorImages ||
        errorSizes ||
        errorColorVariants ||
        errorProductColor ||
        errorStyles ||
        errorCategories
    ) {
        return <Typography color="error">Failed to load data.</Typography>;
    }

    if (!product) {
        return <Typography>Product not found.</Typography>;
    }

    const styleName = styles.find((s: any) => s.id === product.style_id)?.name || '';
    const CategoryName = categories.find((s: any) => s.id === product.category_id)?.name || '';

    return (
        <>
            <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        {selectedImage && (
                            <Box sx={{ mb: 2 }}>
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    style={{ width: '100%', borderRadius: 8 }}
                                />
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {productImages.map((img: any) => (
                                <img
                                    key={img.id}
                                    src={img.image_url}
                                    alt="Thumbnail"
                                    onClick={() => setSelectedImage(img.image_url)}
                                    style={{
                                        width: 107,
                                        height: 107,
                                        objectFit: 'cover',
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                        border:
                                            selectedImage === img.image_url
                                                ? '2px solid #000'
                                                : '1px solid #ccc',
                                    }}
                                />
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            fontSize="45px"
                            color="black"
                            gutterBottom
                        >
                            {product.name}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography
                                variant="subtitle1"
                                color="black"
                                sx={{ fontWeight: 'normal' }}
                            >
                                Kiểu dáng: {styleName}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="black"
                                sx={{ fontWeight: 'normal' }}
                            >
                                Danh mục: {CategoryName}
                            </Typography>
                        </Box>

                        <Typography
                            variant="h6"
                            color="black"
                            fontWeight="bold"
                            marginTop="20px"
                            gutterBottom
                            sx={{ fontWeight: 'normal', fontSize: '20px' }}
                        >
                            Giá:{' '}
                            {inventoryForPrice?.selling_price
                                ? Number(inventoryForPrice.selling_price).toLocaleString() + ' VNĐ'
                                : ' '}
                        </Typography>

                        <Divider
                            sx={{
                                borderStyle: 'dashed',
                                borderColor: 'grey.500',
                                borderWidth: '1px 0 0 0',
                                mt: 3,
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
                            {productColorList.map((color: any) => {
                                const colorCode = colorVariants.find(
                                    (v: any) => v.id === color.color_variant_id
                                );
                                return (
                                    <Box key={color.id} sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: '50%',
                                                backgroundColor: colorCode?.color_code,
                                                border: '2px solid #ccc',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>

                        <Divider
                            sx={{
                                borderStyle: 'dashed',
                                borderColor: 'grey.500',
                                borderWidth: '1px 0 0 0',
                                mt: 3,
                            }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
                            <Typography
                                fontWeight="bold"
                                color="black"
                                sx={{ fontWeight: 'normal', mr: 2 }}
                            >
                                Size:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {availableSizes.map((size: any) => (
                                    <Button
                                        key={size}
                                        variant={selectedSize === size ? 'contained' : 'outlined'}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setQuantity(1);
                                        }}
                                        sx={{
                                            minWidth: 56,
                                            borderRadius: 1,
                                            fontWeight: 'bold',
                                            borderColor: selectedSize === size ? 'black' : 'gray',
                                            color: selectedSize === size ? 'white' : 'black',
                                            backgroundColor:
                                                selectedSize === size ? 'black' : 'white',
                                            '&:hover': {
                                                backgroundColor:
                                                    selectedSize === size ? 'black' : '#f5f5f5',
                                            },
                                        }}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
                            <Typography
                                fontWeight="bold"
                                color="black"
                                sx={{ fontWeight: 'normal', mr: 2 }}
                            >
                                Số lượng:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleDecrease}
                                    disabled={quantity <= 1}
                                    sx={{ minWidth: 40, fontWeight: 'bold' }}
                                >
                                    -
                                </Button>
                                <Typography color="black">{quantity}</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleIncrease}
                                    disabled={quantity >= maxQuantity}
                                    sx={{ minWidth: 40, fontWeight: 'bold' }}
                                >
                                    +
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: '30px' }}>
                            <Button
                                variant="contained"
                                sx={{ background: 'var(--color-primary-main)' }}
                                onClick={handleAddToCart}
                            >
                                THÊM VÀO GIỎ
                            </Button>

                            <Button
                                variant="contained"
                                sx={{ background: 'var(--color-primary-main)' }}
                            >
                                THANH TOÁN
                            </Button>
                        </Box>

                        <Divider
                            sx={{
                                borderStyle: 'dashed',
                                borderColor: 'grey.500',
                                borderWidth: '1px 0 0 0',
                                mt: 3,
                            }}
                        />

                        <Typography variant="body1" color="black" sx={{ mt: 3 }}>
                            {product.description}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Divider
                sx={{
                    borderStyle: 'dashed',
                    borderColor: 'grey.500',
                    borderWidth: '1px 0 0 0',
                    mt: 3,
                }}
            />

            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography
                    variant="h5"
                    fontWeight={600}
                    mb={2}
                    sx={{ color: 'black', fontSize: '25px' }}
                >
                    Sản phẩm liên quan
                </Typography>
                <RelatedProducts currentProductId={product.id} categoryId={product.category_id} />
            </Box>

            <Divider
                sx={{
                    borderStyle: 'dashed',
                    borderColor: 'grey.500',
                    borderWidth: '1px 0 0 0',
                    mt: 3,
                }}
            />

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 900,
                    mx: 'auto',
                    mt: 4,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ width: '100%', mb: 4 }}>
                    <Review product_id={productId} user_id={userId} />
                </Box>
                <Box sx={{ width: '100%' }}>
                    <ReviewList reviews={reviews} reviewsPerPage={3} />
                </Box>
            </Box>
        </>
    );
};

export default ProductDetail;
