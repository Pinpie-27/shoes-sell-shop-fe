import React from 'react';

import { Container, Grid, Typography } from '@mui/material';

import { useGetCategories, useGetProducts } from '@/lib/hooks/features';
import { useGetColorVariants } from '@/lib/hooks/features/colorVariants';
import { useGetInventoryGroup } from '@/lib/hooks/features/inventory';
import { useGetProductColors } from '@/lib/hooks/features/product-colors';
import { useGetProductImages } from '@/lib/hooks/features/product-images';
import { useGetStyles } from '@/lib/hooks/features/styles';

import ProductCard from '../ProductCard';

const ProductListPage: React.FC = () => {
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
        return <Typography>Loading...</Typography>;
    if (
        errorInventories ||
        errorImages ||
        errorCategories ||
        errorProducts ||
        errorStyles ||
        errorProductColor ||
        errorColorVariants
    )
        return <Typography color="error">Failed to load data.</Typography>;

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
        const category = categories.find(
            (category: any) => category.id === productData?.category_id
        );
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
        };
    });

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                {productsWithImage.map((inventory: any) => (
                    <Grid item xs={12} sm={6} md={3} key={inventory.product_id}>
                        <ProductCard product={inventory} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductListPage;
