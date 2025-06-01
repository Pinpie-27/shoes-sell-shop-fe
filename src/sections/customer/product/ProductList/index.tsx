import React, { useState } from 'react';

import {
    Box,
    Container,
    Grid,
    Pagination,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useAtom } from 'jotai';

import { filterAtom } from '@/atoms/filterAtom';
import { searchQueryAtom } from '@/atoms/searchAtom';
import { useGetCategories, useGetProducts } from '@/lib/hooks/features';
import { useGetColorVariants } from '@/lib/hooks/features/colorVariants';
import { useGetInventoryGroup } from '@/lib/hooks/features/inventory';
import { useGetProductColors } from '@/lib/hooks/features/product-colors';
import { useGetProductImages } from '@/lib/hooks/features/product-images';
import { useGetStyles } from '@/lib/hooks/features/styles';

import ProductCard from '../ProductCard';

const ProductListPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery] = useAtom(searchQueryAtom);
    const [filter] = useAtom(filterAtom);

    const itemsPerPage = 8;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            <Typography textAlign="center" mt={8}>
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
            <Typography color="error" textAlign="center" mt={8}>
                Lỗi khi tải dữ liệu. Vui lòng thử lại sau.
            </Typography>
        );

    const uniqueInventoriesMap = new Map();

    inventories.forEach((inventory: any) => {
        if (!uniqueInventoriesMap.has(inventory.product_id)) {
            uniqueInventoriesMap.set(inventory.product_id, inventory);
        }
    });

    const uniqueInventories = Array.from(uniqueInventoriesMap.values());

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

    const filteredProducts = productsWithImage.filter((item: any) => {
        const name = item.product_name?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        const matchQuery = name.includes(query);
        const matchStyle = filter.styleId ? item.style_id === filter.styleId : true;
        const matchCategory = filter.categoryId ? item.category_id === filter.categoryId : true;
        const matchColor = filter.colorId ? item.color_variant_id === filter.colorId : true;

        return matchQuery && matchStyle && matchCategory && matchColor;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 6, mb: 10, backgroundColor: '#f7f9fb' }}>
            <Typography
                variant="h4"
                textAlign="center"
                mb={4}
                fontWeight={700}
                color="primary"
                sx={{
                    letterSpacing: 1.2,
                    fontSize: isMobile ? '1.8rem' : '2.4rem',
                }}
            />

            <Grid container spacing={4}>
                {paginatedProducts.map((inventory: any) => (
                    <Grid item xs={12} sm={6} md={3} key={inventory.product_id}>
                        <Box
                            sx={{
                                boxShadow: 3,
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <ProductCard product={inventory} />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box mt={6} display="flex" justifyContent="center">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    shape="rounded"
                    size={isMobile ? 'medium' : 'large'}
                    sx={{
                        '& .MuiPaginationItem-root': {
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            color: '#444',
                        },
                        '& .Mui-selected': {
                            backgroundColor: '#FFCC80',
                            color: '#444',
                            '&:hover': {
                                backgroundColor: '#FFA726',
                            },
                        },
                    }}
                />
            </Box>
        </Container>
    );
};

export default ProductListPage;
