import React from 'react';

import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
// eslint-disable-next-line max-len
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import {
    formStructureOrderItemStatus,
    useGetAllOrderItems,
    useUpdateOrderItemStatus,
} from '@/lib/hooks/features/orderItems';

interface Order_Items {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    status: string;
}

export const OrderItemForm: React.FC = () => {
    const { data: orderItems, isLoading, isError, error } = useGetAllOrderItems();
    const { mutate: updateStatus } = useUpdateOrderItemStatus();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedOrderItem, setSelectedOrderItem] = React.useState<Order_Items | null>(null);

    const formHandler = useForm<Order_Items>({
        defaultValues: {
            id: 0,
            status: '',
        },
    });

    const { handleSubmit, reset } = formHandler;

    const handleOpenDialog = (orderItem: Order_Items) => {
        setSelectedOrderItem(orderItem);
        reset({
            id: orderItem.id,
            status: orderItem.status,
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrderItem(null);
    };

    const onSubmit = (data: Order_Items) => {
        if (selectedOrderItem) {
            console.log('Updating status:', {
                id: selectedOrderItem.id,
                updatedStatus: { status: data.status },
            });

            updateStatus({
                id: selectedOrderItem.id,
                updatedStatus: { status: data.status },
            });
        }
        handleCloseDialog();
    };

    if (isLoading) return <p>Loading order items...</p>;
    if (isError) return <p>Error fetching order items: {error?.message}</p>;

    return (
        <Box sx={{ padding: '30px' }}>
            <TableContainer sx={{ padding: '1rem', marginTop: '30px' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                OrderId
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                ProductId
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Quantity
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Price
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Status
                            </TableCell>
                            <TableCell
                                sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderItems.map((orderItem: Order_Items) => (
                            <TableRow key={orderItem.id}>
                                <TableCell sx={{ color: 'black' }}>{orderItem.id}</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {orderItem.order_id}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {orderItem.product_id}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {orderItem.quantity}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {orderItem.price}
                                </TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>
                                    {orderItem.status}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => handleOpenDialog(orderItem)}>
                                        <EditNoteOutlinedIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Order Item Status</DialogTitle>
                <DialogContent>
                    <FieldGroup
                        formHandler={formHandler}
                        formStructure={formStructureOrderItemStatus}
                        spacing={tw`gap-4 mt-4`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} color="success">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
