/* eslint-disable arrow-body-style */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FieldGroup } from '@/components/interactive';
import { useSchema } from '@/lib/hooks';
import { useGetVipLevels } from '@/lib/hooks/features';
import { useDeleteUser } from '@/lib/hooks/features/users/delete-user';
import { useGetUsers } from '@/lib/hooks/features/users/get-user';
import { formStructureSearchUser, useSearchUsers } from '@/lib/hooks/features/users/search-user';
import { formStructureUser, useUpdateUser } from '@/lib/hooks/features/users/update-user';

interface User {
    id: number;
    username: string;
    email: string;
    phone: number;
    address: string;
    vip_level_id: number;
    role: string;
}
type VipLevel = {
    id: number;
    level_name: string;
};

export const UserForm: React.FC = () => {
    const { data: users, isLoading, isError, error } = useGetUsers();
    const { data: vipLevels } = useGetVipLevels();
    const { mutate: deleteUser } = useDeleteUser();
    const { mutate: updateUser } = useUpdateUser();

    const [searchTerm, setSearchTerm] = React.useState('');
    const { data: searchedUsers } = useSearchUsers(searchTerm);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

    const vipLevelOptions = React.useMemo(() => {
        if (!vipLevels) return [];

        const uniqueLevels = Array.from(
            new Map(vipLevels.map((v: VipLevel) => [v.id, v])).values()
        ) as VipLevel[];

        return uniqueLevels.map((level) => ({
            label: level.level_name,
            value: level.id,
        }));
    }, [vipLevels]);

    const roleOptions = React.useMemo(() => {
        const uniqueRoles = Array.from(new Set(users?.map((user: any) => user.role)));

        return uniqueRoles.map((role: any) => ({
            label: role.charAt(0).toUpperCase() + role.slice(1),
            value: role,
        }));
    }, [users]);

    const getVipLevelName = (id: number) => {
        const found = vipLevels?.find((v: VipLevel) => v.id === id);
        return found?.level_name || `Level ${id}`;
    };

    // Pagination states
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleOpenDialog = (id: number) => {
        setSelectedUser(users.find((user: User) => user.id === id) || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleConfirmDelete = () => {
        if (selectedUser?.id !== undefined) {
            deleteUser(selectedUser.id);
        }
        handleCloseDialog();
    };

    const handleOpenEditDialog = (user: User) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedUser(null);
    };

    const schema = useSchema<typeof selectedUser>(formStructureUser, {
        check: () => {
            return true;
        },
    });

    const formHandler = useForm<User>({
        resolver: zodResolver(schema),
        defaultValues: selectedUser ?? {},
    });

    const handleEditSubmit = formHandler.handleSubmit(
        (updatedUser) => {
            if (selectedUser) {
                updateUser({ id: selectedUser.id, updatedUser });
            }
            handleCloseEditDialog();
        },
        (errors) => {
            const firstError = Object.values(errors)?.[0];
            if (firstError && typeof firstError.message === 'string') {
                toast.error(firstError.message);
            } else {
                toast.error('Vui lòng kiểm tra lại thông tin');
            }
        }
    );

    React.useEffect(() => {
        if (selectedUser) {
            formHandler.reset(selectedUser);
        }
    }, [selectedUser, formHandler]);

    const formHandlerSearch = useForm<{ search: string }>({
        defaultValues: { search: '' },
    });

    React.useEffect(() => {
        const subscription = formHandlerSearch.watch((value) => {
            setSearchTerm(value.search || '');
            setPage(0); // Reset to first page when searching
        });

        return () => subscription.unsubscribe();
    }, [formHandlerSearch]);

    // Get current data (search results or all users)
    const currentData = searchedUsers?.length ? searchedUsers : users || [];

    // Pagination logic
    const totalRows = currentData.length;
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = currentData.slice(startIndex, endIndex);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                }}
            >
                <Typography variant="h6" sx={{ color: '#6b7280' }}>
                    Đang tải dữ liệu...
                </Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                }}
            >
                <Typography variant="h6" sx={{ color: '#dc2626' }}>
                    Lỗi khi tải dữ liệu: {error?.message}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                padding: '32px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <PersonIcon sx={{ mr: 2, fontSize: '2rem' }} />
                    Quản lý người dùng
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Danh sách và quản lý tài khoản người dùng trong hệ thống
                </Typography>
            </Box>

            {/* Search Section */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600 }}>
                            Tìm kiếm người dùng
                        </Typography>
                    </Box>
                    <FieldGroup
                        formHandler={formHandlerSearch}
                        formStructure={formStructureSearchUser}
                        spacing={tw`gap-4`}
                    />
                </CardContent>
            </Card>

            {/* Table */}
            <Card elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <TableContainer
                    component={Paper}
                    sx={{
                        background: '#ffffff',
                        maxHeight: '70vh',
                        '& .MuiTable-root': {
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            tableLayout: 'fixed', // Fixed layout để control width
                            width: '100%',
                        },
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                    '& th': {
                                        borderBottom: '2px solid #cbd5e1',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        color: '#334155',
                                        py: 2.5,
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: '#f1f5f9',
                                        zIndex: 1,
                                    },
                                }}
                            >
                                <TableCell sx={{ width: '60px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>ID</Box>
                                </TableCell>
                                <TableCell sx={{ width: '180px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Tên người dùng
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '200px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EmailIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Email
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '140px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PhoneIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Số điện thoại
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '200px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationOnIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Địa chỉ
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '100px' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <StarIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        VIP
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '100px' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <AdminPanelSettingsIcon
                                            sx={{ mr: 1, fontSize: '1.2rem', color: '#64748b' }}
                                        />
                                        Vai trò
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '120px' }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData?.map((user: User) => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f8fafc !important',
                                            transition: 'background-color 0.2s ease',
                                        },
                                        '&:nth-of-type(even)': {
                                            backgroundColor: '#f9fafb',
                                        },
                                        '& td': {
                                            borderBottom: '1px solid #e5e7eb',
                                            fontSize: '0.9rem',
                                            py: 1.5,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        },
                                    }}
                                >
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',

                                                color: '#334155',
                                                fontWeight: 700,
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            {user.id}
                                        </Box>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'start',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: 400,
                                                        color: '#374151',
                                                        fontSize: '0.9rem',
                                                    }}
                                                >
                                                    {user.username}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                color: '#374151',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {user.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                color: '#374151',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {user.phone}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                color: '#374151',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {user.address}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                color: '#374151',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {getVipLevelName(user.vip_level_id)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                color: '#374151',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {user.role}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Tooltip title="Chỉnh sửa">
                                                <IconButton
                                                    onClick={() => handleOpenEditDialog(user)}
                                                    size="small"
                                                    sx={{
                                                        color: '#3b82f6',
                                                        '&:hover': {
                                                            backgroundColor: '#dbeafe',
                                                        },
                                                        transition: 'background-color 0.2s ease',
                                                    }}
                                                >
                                                    <EditNoteOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton
                                                    onClick={() => handleOpenDialog(user.id)}
                                                    size="small"
                                                    sx={{
                                                        color: '#dc2626',
                                                        '&:hover': {
                                                            backgroundColor: '#fef2f2',
                                                        },
                                                        transition: 'background-color 0.2s ease',
                                                    }}
                                                >
                                                    <DeleteOutlineRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <Box
                    sx={{
                        borderTop: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb',
                    }}
                >
                    <TablePagination
                        component="div"
                        count={totalRows}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15, 25, 50]}
                        labelRowsPerPage="Số hàng mỗi trang:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
                        }
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        '& .MuiMenuItem-root': {
                                            fontSize: '0.9rem',
                                            color: '#374151',
                                        },
                                    },
                                },
                            },
                        }}
                        sx={{
                            '& .MuiTablePagination-toolbar': {
                                fontSize: '0.9rem',
                                color: '#374151',
                                px: 3,
                                py: 2,
                            },
                            '& .MuiTablePagination-selectLabel': {
                                fontSize: '0.9rem',
                                color: '#374151',
                                fontWeight: 500,
                            },
                            '& .MuiTablePagination-displayedRows': {
                                fontSize: '0.9rem',
                                color: '#374151',
                                fontWeight: 500,
                            },
                            '& .MuiTablePagination-select': {
                                fontSize: '0.9rem',
                                color: '#374151',
                            },
                            '& .MuiIconButton-root': {
                                color: '#374151',
                                '&:hover': {
                                    backgroundColor: '#e5e7eb',
                                },
                                '&.Mui-disabled': {
                                    color: '#9ca3af',
                                },
                            },
                        }}
                    />
                </Box>
            </Card>

            {/* Summary Info */}
            {totalRows > 0 && (
                <Box
                    sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#64748b',
                        fontSize: '0.9rem',
                    }}
                >
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {searchTerm ? (
                            <>
                                Tìm thấy <strong>{totalRows}</strong> kết quả cho "
                                <strong>{searchTerm}</strong>"
                            </>
                        ) : (
                            <>
                                Tổng cộng <strong>{totalRows}</strong> người dùng trong hệ thống
                            </>
                        )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Trang {page + 1} / {Math.ceil(totalRows / rowsPerPage)}
                    </Typography>
                </Box>
            )}

            {/* Delete Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        minWidth: '400px',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: '#1f2937',
                        fontWeight: 700,
                        fontSize: '1.3rem',
                        pb: 1,
                    }}
                >
                    Xác nhận xóa
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: '#4b5563',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                        }}
                    >
                        Bạn có chắc chắn muốn xóa người dùng{' '}
                        <strong>{selectedUser?.username}</strong> không? Hành động này không thể
                        hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: '#6b7280',
                            borderColor: '#d1d5db',
                            '&:hover': {
                                borderColor: '#9ca3af',
                                backgroundColor: '#f9fafb',
                            },
                        }}
                        variant="outlined"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        sx={{
                            backgroundColor: 'primary',
                        }}
                        variant="contained"
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxHeight: '90vh',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: '#1f2937',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        borderBottom: '1px solid #e5e7eb',
                        pb: 2,
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EditNoteOutlinedIcon sx={{ mr: 2 }} />
                        Chỉnh sửa thông tin người dùng
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {selectedUser && (
                        <FieldGroup
                            formHandler={formHandler}
                            formStructure={formStructureUser}
                            spacing={tw`gap-4`}
                            selectOptions={{
                                vip_level_id: vipLevelOptions,
                                role: roleOptions,
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                    <Button
                        onClick={handleCloseEditDialog}
                        sx={{
                            color: '#6b7280',
                            borderColor: '#d1d5db',
                            '&:hover': {
                                borderColor: '#9ca3af',
                                backgroundColor: '#f9fafb',
                            },
                        }}
                        variant="outlined"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleEditSubmit}
                        sx={{
                            backgroundColor: 'primary',
                        }}
                        variant="contained"
                    >
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
