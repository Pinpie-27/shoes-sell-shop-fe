/* eslint-disable max-lines */
import React from 'react';

import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import { filterAtom } from '@/atoms/filterAtom';
import { searchQueryAtom } from '@/atoms/searchAtom';
import { useGetCategories, useGetProducts } from '@/lib/hooks/features';
import { useGetColorVariants } from '@/lib/hooks/features/colorVariants';
import { useGetInventoryGroup } from '@/lib/hooks/features/inventory';
import { useGetProductColors } from '@/lib/hooks/features/product-colors';
import { useGetProductImages } from '@/lib/hooks/features/product-images';
import { useGetStyles } from '@/lib/hooks/features/styles';

import ProductCard from '../product/ProductCard';

export const ComingSoon: React.FC = () => {
    const [searchQuery] = useAtom(searchQueryAtom);
    const [filter] = useAtom(filterAtom);

    const navigate = useNavigate();

    const {
        data: inventories,
        isLoading: loadingInventories,
        isError: errorInventories,
    } = useGetInventoryGroup();
    const { data: images, isLoading: loadingImages, isError: errorImages } = useGetProductImages();
    const {
        data: categories,
        isLoading: loadingCategories,
        isError: errorCategories,
    } = useGetCategories();
    const { data: products, isLoading: loadingProducts, isError: errorProducts } = useGetProducts();
    const { data: styles, isLoading: loadingStyles, isError: errorStyles } = useGetStyles();
    const {
        data: productColors,
        isLoading: loadingProductColor,
        isError: errorProductColor,
    } = useGetProductColors();
    const {
        data: colorVariants,
        isLoading: loadingColorVariants,
        isError: errorColorVariants,
    } = useGetColorVariants();

    if (
        loadingInventories ||
        loadingImages ||
        loadingCategories ||
        loadingProducts ||
        loadingStyles ||
        loadingProductColor ||
        loadingColorVariants
    )
        return (
            <Typography
                textAlign="center"
                mt={8}
                sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1.2rem',
                    color: '#6366f1',
                    fontWeight: 500,
                }}
            >
                Đang tải sản phẩm...
            </Typography>
        );

    if (
        errorInventories ||
        errorImages ||
        errorCategories ||
        errorProducts ||
        errorStyles ||
        errorProductColor ||
        errorColorVariants
    )
        return (
            <Typography
                color="#ef4444"
                textAlign="center"
                mt={8}
                sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 500,
                }}
            >
                Lỗi khi tải dữ liệu. Vui lòng thử lại sau.
            </Typography>
        );

    // Lấy inventory duy nhất theo product_id
    const uniqueInventoriesMap = new Map();
    inventories.forEach((inventory: any) => {
        if (!uniqueInventoriesMap.has(inventory.product_id)) {
            uniqueInventoriesMap.set(inventory.product_id, inventory);
        }
    });
    const uniqueInventories = Array.from(uniqueInventoriesMap.values());

    // Gắn thêm thông tin ảnh, tên, style, category, màu cho từng sản phẩm
    const productsWithImage = uniqueInventories.map((inventory: any) => {
        const productImages = images.filter((img: any) => img.product_id === inventory.product_id);
        const productData = products.find((product: any) => product.id === inventory.product_id);
        const category = categories.find((cat: any) => cat.id === productData?.category_id);
        const style = styles.find((sty: any) => sty.id === productData?.style_id);
        const productColor = productColors.find(
            (pColor: any) => pColor.product_id === inventory.product_id
        );
        const colorName = colorVariants.find(
            (c: any) => c.id === productColor?.color_variant_id
        )?.variant_name;

        return {
            ...inventory,
            image: productImages.length > 0 ? productImages[0].image_url : '',
            productColor: colorName,
            product_name: productData?.name,
            category_name: category?.name,
            style_name: style?.name,
            style_id: productData?.style_id,
            category_id: productData?.category_id,
            color_variant_id: productColor?.color_variant_id,
        };
    });

    // Lọc theo search và filter
    const filteredProducts = productsWithImage.filter((item: any) => {
        const name = item.product_name?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        const matchQuery = name.includes(query);
        const matchStyle = filter.styleId ? item.style_id === filter.styleId : true;
        const matchCategory = filter.categoryId ? item.category_id === filter.categoryId : true;
        const matchColor = filter.colorId ? item.color_variant_id === filter.colorId : true;

        return matchQuery && matchStyle && matchCategory && matchColor;
    });

    const displayedProducts = filteredProducts.slice(0, 4);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                py: { xs: 4, md: 8 },
                px: { xs: 2, md: 6 },
            }}
        >
            {/* Banner section */}
            <Box
                sx={{
                    width: '100%',
                    minHeight: 320,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', md: 'row' },
                    mb: 8,
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        zIndex: 1,
                    },
                }}
            >
                <Box sx={{ flex: 1, p: { xs: 3, md: 6 }, position: 'relative', zIndex: 2 }}>
                    <Typography
                        variant="h2"
                        fontWeight={800}
                        color="#ffffff"
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            fontSize: { xs: '2rem', md: '3rem' },
                            mb: 2,
                            background: 'linear-gradient(45deg, #ffffff 30%, #e2e8f0 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        GIÀY SNEAKER CHÍNH HÃNG
                    </Typography>
                    <Typography
                        variant="h5"
                        color="#f1f5f9"
                        mt={2}
                        mb={2}
                        sx={{
                            fontWeight: 600,
                            fontSize: { xs: '1.1rem', md: '1.4rem' },
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        Đậm chất trẻ, chất lượng thật, giá hợp lý!
                    </Typography>
                    <Typography
                        color="#e2e8f0"
                        fontSize="1rem"
                        maxWidth={500}
                        mb={3}
                        sx={{
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.6,
                            opacity: 0.9,
                        }}
                    >
                        Khám phá bộ sưu tập giày sneaker thời trang, đa dạng kiểu dáng, màu sắc, phù
                        hợp mọi phong cách. Cam kết hàng chính hãng, đổi trả dễ dàng, giao hàng toàn
                        quốc.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 2,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: '#ffffff',
                            fontWeight: 700,
                            borderRadius: 3,
                            px: 5,
                            py: 1.5,
                            fontSize: '1.1rem',
                            textTransform: 'uppercase',
                            fontFamily: "'Poppins', sans-serif",
                            boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 30px rgba(245, 158, 11, 0.4)',
                            },
                        }}
                        onClick={() => navigate('/customers/homepage/products')}
                    >
                        Xem tất cả sản phẩm
                    </Button>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 320,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 2, md: 4 },
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <img
                        src="https://ananas.vn/wp-content/themes/ananas/fe-assets/images/svg/shop.svg"
                        alt="Banner Sneaker"
                        style={{
                            width: '100%',
                            maxWidth: 400,
                            borderRadius: 24,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                            objectFit: 'cover',
                            filter: 'brightness(1.1)',
                        }}
                    />
                </Box>
            </Box>

            {/* Feature section */}
            <Grid container spacing={4} mb={8}>
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            borderRadius: 4,
                            p: 4,
                            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.08)',
                            height: '100%',
                            textAlign: 'center',
                            border: '1px solid rgba(99, 102, 241, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)',
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#6366f1"
                            mb={2}
                            sx={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '1.2rem',
                            }}
                        >
                            ĐA DẠNG KIỂU DÁNG
                        </Typography>
                        <Typography
                            color="#475569"
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                lineHeight: 1.6,
                                fontSize: '0.95rem',
                            }}
                        >
                            Từ basic đến trendy, phù hợp đi học, đi làm, đi chơi. Luôn cập nhật mẫu
                            mới nhất.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            borderRadius: 4,
                            p: 4,
                            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.08)',
                            height: '100%',
                            textAlign: 'center',
                            border: '1px solid rgba(99, 102, 241, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)',
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#6366f1"
                            mb={2}
                            sx={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '1.2rem',
                            }}
                        >
                            CHÍNH HÃNG - GIÁ TỐT
                        </Typography>
                        <Typography
                            color="#475569"
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                lineHeight: 1.6,
                                fontSize: '0.95rem',
                            }}
                        >
                            Cam kết sản phẩm chính hãng, chất lượng đảm bảo, giá cả cạnh tranh, ưu
                            đãi hấp dẫn.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            borderRadius: 4,
                            p: 4,
                            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.08)',
                            height: '100%',
                            textAlign: 'center',
                            border: '1px solid rgba(99, 102, 241, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)',
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#6366f1"
                            mb={2}
                            sx={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '1.2rem',
                            }}
                        >
                            GIAO HÀNG TOÀN QUỐC
                        </Typography>
                        <Typography
                            color="#475569"
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                lineHeight: 1.6,
                                fontSize: '0.95rem',
                            }}
                        >
                            Đặt hàng online dễ dàng, giao hàng nhanh chóng, đổi trả linh hoạt trong
                            7 ngày.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Danh sách sản phẩm sắp ra mắt */}
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography
                    variant="h5"
                    fontWeight={600}
                    mb={2}
                    sx={{ color: 'black', fontSize: '25px' }}
                >
                    Sản phẩm nổi bật
                </Typography>
            </Box>
            <Container maxWidth="lg" sx={{ px: 0 }}>
                <Grid container spacing={4}>
                    {displayedProducts.map((inventory: any) => (
                        <Grid item xs={12} sm={6} md={3} key={inventory.product_id}>
                            <Box
                                sx={{
                                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid rgba(99, 102, 241, 0.05)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)',
                                    },
                                }}
                            >
                                <ProductCard product={inventory} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ComingSoon;
