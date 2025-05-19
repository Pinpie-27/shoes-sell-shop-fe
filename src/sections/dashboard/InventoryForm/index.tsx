/* eslint-disable max-lines */
import React from 'react';

import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

import { useGetInventory } from '@/lib/hooks/features/inventory';

interface Inventory {
    id: number;
    product_id: number;
    size: string;
    quantity: number;
    selling_price: number;
}

export const InventoryForm: React.FC = () => {
    const { data: inventories, isLoading, isError, error } = useGetInventory();

    if (isLoading) return <p>Loading inventories...</p>;
    if (isError) return <p>Error fetching inventories: {error?.message}</p>;

    return (
        <Box sx={{ padding: '30px' }}>
           
            <TableContainer sx={{ padding: '1rem', marginTop: '30px' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                                Product Id
                            </TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Size</TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Quantity
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Selling Pice
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventories?.map((inventory: Inventory) => (
                            <TableRow key={inventory.id}>
                                <TableCell sx={{ color: 'black' }}>{inventory.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>
                                    {inventory.product_id}
                                </TableCell>
                                <TableCell sx={{ color: 'black' }}>{inventory.size}</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {inventory.quantity}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {inventory.selling_price}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
