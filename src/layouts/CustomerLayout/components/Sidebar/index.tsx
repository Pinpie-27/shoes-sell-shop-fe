/* eslint-disable react/no-unknown-property */
import React from 'react';

import { Box, Divider, Drawer, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import { filterAtom } from '@/atoms/filterAtom';
import { Img } from '@/components/Elements';
import { useGetCategories } from '@/lib/hooks/features';
import { useGetColorVariants } from '@/lib/hooks/features/colorVariants';
import { useGetStyles } from '@/lib/hooks/features/styles/get-style';

import ananasLogo from '../../../../assets/images/auth/ananas_logo.svg';

interface SideBarProps {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();

    const { data: colorVariants, isLoading, error } = useGetColorVariants();
    const { data: styles, isLoading: loadingStyles, error: errorStyles } = useGetStyles();
    const {
        data: categories,
        isLoading: loadingCategories,
        error: errorCategories,
    } = useGetCategories();

    const [filter, setFilter] = useAtom(filterAtom);
    return (
        <Drawer
            variant="persistent"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '260px',
                    transition: 'width 0.3s ease-in-out',
                    overflow: 'hidden',
                    zIndex: 1200,
                },
            }}
        >
            <Box tw="flex flex-col h-full p-2 overflow-y-auto">
                <Box
                    tw="h-[60px] p-6 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                        navigate(`/customers/homepage`);
                    }}
                >
                    <Img src={ananasLogo} alt="Logo" tw="w-full h-auto" />
                </Box>

                <Box tw="mt-4">
                    <Typography
                        component="h3"
                        tw="mb-2"
                        sx={{
                            color: 'var(--color-primary-main)',
                            fontWeight: 700,
                            fontSize: '1rem',
                        }}
                    >
                        Kiểu dáng
                    </Typography>

                    {loadingStyles && <p>Loading styles...</p>}
                    {errorStyles && <p>Error loading styles</p>}

                    <Box tw="flex flex-col gap-1 max-h-48">
                        {styles?.map((style: any) => (
                            <Box
                                key={style.id}
                                onClick={() =>
                                    setFilter({
                                        styleId: style.id,
                                        categoryId: null,
                                        colorId: null,
                                    })
                                }
                                tw="px-3 py-2 rounded cursor-pointer"
                                sx={{
                                    backgroundColor:
                                        filter.styleId === style.id ? '#d1eaff' : 'transparent',
                                    color: filter.styleId === style.id ? '#1976d2' : '#000',
                                    transition: 'background-color 0.2s ease',
                                    fontWeight: filter.styleId === style.id ? 600 : 400,
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                    },
                                }}
                                title={style.name}
                            >
                                {style.name}
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Divider
                    sx={{
                        borderStyle: 'dashed',
                        borderColor: 'grey.500',
                        borderWidth: '1px 0 0 0',
                        mt: 3,
                    }}
                />

                <Box tw="mt-4">
                    <Typography
                        component="h3"
                        tw="mb-2"
                        sx={{
                            color: 'var(--color-primary-main)',
                            fontWeight: 700,
                            fontSize: '1rem',
                        }}
                    >
                        Bộ sưu tập
                    </Typography>

                    {loadingCategories && <p>Loading styles...</p>}
                    {errorCategories && <p>Error loading styles</p>}

                    <Box tw="flex flex-col gap-1 max-h-48">
                        {categories?.map((category: any) => (
                            <Box
                                key={category.id}
                                onClick={() =>
                                    setFilter({
                                        styleId: null,
                                        categoryId: category.id,
                                        colorId: null,
                                    })
                                }
                                tw="px-3 py-2 rounded cursor-pointer"
                                sx={{
                                    backgroundColor:
                                        filter.categoryId === category.id
                                            ? '#d1eaff'
                                            : 'transparent',
                                    color: filter.categoryId === category.id ? '#1976d2' : '#000',
                                    transition: 'background-color 0.2s ease',
                                    fontWeight: filter.categoryId === category.id ? 600 : 400,
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                    },
                                }}
                                title={category.name}
                            >
                                {category.name}
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Divider
                    sx={{
                        borderStyle: 'dashed',
                        borderColor: 'grey.500',
                        borderWidth: '1px 0 0 0',
                        mt: 3,
                    }}
                />
                <Box tw="mt-4">
                    <h3
                        tw="mb-2 text-lg font-semibold"
                        style={{ color: 'var(--color-primary-main)' }}
                    >
                        Màu sắc
                    </h3>

                    {isLoading && <p>Loading colors...</p>}
                    {error && <p>Error loading colors</p>}

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {colorVariants?.map((color: any) => {
                            const isSelected = filter.colorId === color.id;

                            return (
                                <Box
                                    key={color.id}
                                    onClick={() =>
                                        setFilter({
                                            styleId: null,
                                            categoryId: null,
                                            colorId: color.id,
                                        })
                                    }
                                    sx={{ textAlign: 'center' }}
                                >
                                    <Box
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: '50%',
                                            backgroundColor: color.color_code,
                                            border: isSelected
                                                ? '3px solid #1976d2'
                                                : '2px solid #ccc',
                                            cursor: 'pointer',
                                            boxShadow: isSelected ? '0 0 0 2px #bbdefb' : 'none',
                                        }}
                                        title={color.name || color.color_code}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
};
