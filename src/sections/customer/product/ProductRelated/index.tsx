import { Box, Grid } from '@mui/material';

import { useGetCategories, useGetProducts } from '@/lib/hooks/features';
import { useGetColorVariants } from '@/lib/hooks/features/colorVariants';
import { useGetInventory } from '@/lib/hooks/features/inventory';
import { useGetProductColors } from '@/lib/hooks/features/product-colors';
import { useGetProductImages } from '@/lib/hooks/features/product-images';
import { useGetStyles } from '@/lib/hooks/features/styles';

import ProductCard from '../ProductCard';

const RelatedProducts = ({
    currentProductId,
    categoryId,
}: {
    currentProductId: number;
    categoryId: number;
}) => {
    const { data: products = [] } = useGetProducts();
    const { data: inventories = [] } = useGetInventory();
    const { data: images = [] } = useGetProductImages();
    const { data: categories = [] } = useGetCategories();
    const { data: styles = [] } = useGetStyles();
    const { data: productColors = [] } = useGetProductColors();
    const { data: colorVariants = [] } = useGetColorVariants();

    const relatedProducts = products
        .filter((p: any) => p.category_id === categoryId && p.id !== currentProductId)
        .slice(0, 3);

    const productCards = relatedProducts.map((product: any) => {
        const inventory = inventories.find((inv: any) => inv.product_id === product.id);
        const productImages = images.filter((img: any) => img.product_id === product.id);
        const category = categories.find((cat: any) => cat.id === product.category_id);
        const style = styles.find((sty: any) => sty.id === product.style_id);

        const productColor = productColors.find((pColor: any) => pColor.product_id === product.id);
        const colorName = colorVariants.find(
            (c: any) => c.id === productColor?.color_variant_id
        )?.variant_name;

        return {
            product_id: product.id,
            product_name: product.name,
            selling_price: inventory?.selling_price || 0,
            category_name: category?.name || '',
            style_name: style?.name || '',
            productColor: colorName || '',
            image: productImages.length > 0 ? productImages[0].image_url : '',
        };
    });

    return (
        <Box
            mt={6}
            sx={{ minWidth: 300, width: '100%' }}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Grid
                container
                spacing={3}
                justifyContent="center"
                sx={{ maxWidth: 900, width: '100%' }}
            >
                {productCards.map((product: any) => (
                    <Grid item xs={12} sm={6} md={4} key={product.product_id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default RelatedProducts;
