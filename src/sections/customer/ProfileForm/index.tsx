/* eslint-disable max-lines */
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateUser } from '@/lib/hooks/features';
import { useGetUserUsername } from '@/lib/hooks/features/profile/get-UserByUsername';

const ProfileForm = ({ username }: { username: string }) => {
    const { data: user, isLoading, isError } = useGetUserUsername(username);
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Validation schema
    const schema = z.object({
        email: z.string().refine(
            (val) => {
                if (!val || val === '') return true; // Allow empty
                return z.string().email().safeParse(val).success;
            },
            { message: 'Email không hợp lệ' }
        ),
        phone: z
            .string()
            .refine(
                (val) => {
                    if (!val || val === '') return true;
                    const phoneRegex = /^[0-9\s]*$/;
                    return phoneRegex.test(val);
                },
                { message: 'Chỉ được nhập số' }
            )
            .refine(
                (val) => {
                    if (!val || val === '') return true;
                    const cleanPhone = val.replace(/\s/g, '');
                    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
                },
                { message: 'Số điện thoại phải có 10-11 chữ số' }
            )
            .refine(
                (val) => {
                    if (!val || val === '') return true;
                    const cleanPhone = val.replace(/\s/g, '');
                    return /^(0[3|5|7|8|9])[0-9]{8,9}$/.test(cleanPhone);
                },
                { message: 'Số điện thoại không đúng định dạng Việt Nam' }
            ),
        address: z.string().refine(
            (val) => {
                if (!val || val === '') return true;
                return val.length <= 255;
            },
            { message: 'Địa chỉ không được quá 255 ký tự' }
        ),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            phone: '',
            address: '',
        },
    });

    // Update form default values when user data loads
    useEffect(() => {
        if (user) {
            setValue('email', user.email || '');
            setValue('phone', user.phone || '');
            setValue('address', user.address || '');
        }
    }, [user, setValue]);

    const handleEditClick = () => {
        if (user) {
            // Đảm bảo form được reset với dữ liệu hiện tại
            reset({
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
            setIsEditDialogOpen(true);
        }
    };

    const handleSave = (data: any) => {
        if (user) {
            const updatedData = {
                ...data,
                phone: data.phone ? data.phone.replace(/\s/g, '') : '', // Remove spaces from phone
            };

            updateUser(
                { id: user.id, updatedUser: updatedData },
                {
                    onSuccess: () => {
                        setIsEditDialogOpen(false);
                    },
                    onError: (error) => {
                        console.error('Error updating user:', error);
                    },
                }
            );
        }
    };

    const handleCancel = () => {
        setIsEditDialogOpen(false);
        // Reset form về giá trị ban đầu
        if (user) {
            reset({
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    };

    // Đóng dialog khi click outside hoặc ESC
    const handleDialogClose = (_event: any, reason: string) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            handleCancel();
        }
    };

    if (isLoading)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Typography
                    sx={{
                        color: '#374151',
                        fontWeight: 600,
                        fontSize: '1rem',
                    }}
                >
                    Đang tải thông tin...
                </Typography>
            </Box>
        );

    if (isError || !user)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Typography
                    sx={{
                        color: '#374151',
                        fontWeight: 600,
                        fontSize: '1rem',
                    }}
                >
                    Không tìm thấy người dùng.
                </Typography>
            </Box>
        );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                py: 4,
                px: { xs: 2, sm: 3 },
            }}
        >
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                {/* Header Card */}
                <Card
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        borderRadius: 2,
                        border: '1px solid #E5E7EB',
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 600,
                                color: '#374151',
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                mb: 3,
                            }}
                        >
                            Thông tin cá nhân
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: '#374151',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                }}
                            >
                                Tên đăng nhập: {user.username}
                            </Typography>

                            <Button
                                variant="outlined"
                                onClick={handleEditClick}
                                sx={{
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    fontSize: '0.9rem',
                                }}
                            >
                                Chỉnh sửa thông tin
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Information Cards */}
                <Grid container spacing={3}>
                    {/* Email Card */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 2,
                                border: '1px solid #E5E7EB',
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1.1rem',
                                        mb: 2,
                                    }}
                                >
                                    Email
                                </Typography>
                                <Typography
                                    sx={{
                                        color: user.email ? '#374151' : '#9CA3AF',
                                        fontSize: '1rem',
                                        fontStyle: user.email ? 'normal' : 'italic',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {user.email || 'Chưa cập nhật email'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Phone Card */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 2,
                                border: '1px solid #E5E7EB',
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1.1rem',
                                        mb: 2,
                                    }}
                                >
                                    Số điện thoại
                                </Typography>
                                <Typography
                                    sx={{
                                        color: user.phone ? '#374151' : '#9CA3AF',
                                        fontSize: '1rem',
                                        fontStyle: user.phone ? 'normal' : 'italic',
                                    }}
                                >
                                    {user.phone || 'Chưa cập nhật số điện thoại'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Address Card */}
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                border: '1px solid #E5E7EB',
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#374151',
                                        fontSize: '1.1rem',
                                        mb: 2,
                                    }}
                                >
                                    Địa chỉ
                                </Typography>
                                <Typography
                                    sx={{
                                        color: user.address ? '#374151' : '#9CA3AF',
                                        fontSize: '1rem',
                                        fontStyle: user.address ? 'normal' : 'italic',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {user.address || 'Chưa cập nhật địa chỉ'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Edit Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onClose={handleDialogClose}
                    maxWidth="sm"
                    fullWidth
                    disableEscapeKeyDown={false}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            maxHeight: '80vh',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 600,
                            color: '#374151',
                            fontSize: '1.2rem',
                            textAlign: 'center',
                            borderBottom: '1px solid #E5E7EB',
                        }}
                    >
                        Chỉnh sửa thông tin cá nhân
                    </DialogTitle>

                    <form onSubmit={handleSubmit(handleSave)}>
                        <DialogContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            color: '#374151',
                                            mb: 1,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        Email
                                    </Typography>
                                    <TextField
                                        {...register('email')}
                                        fullWidth
                                        size="small"
                                        placeholder="Nhập email của bạn"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        autoComplete="email"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                color: '#374151 !important',
                                                '&::placeholder': {
                                                    color: '#9CA3AF',
                                                    opacity: 1,
                                                },
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E5E7EB',
                                            },
                                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderColor: '#D1D5DB',
                                                },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderColor: '#3B82F6',
                                                },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            color: '#374151',
                                            mb: 1,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        Số điện thoại
                                    </Typography>
                                    <TextField
                                        {...register('phone')}
                                        fullWidth
                                        size="small"
                                        placeholder="Nhập số điện thoại (VD: 0901234567)"
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        autoComplete="tel"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                color: '#374151 !important',
                                                '&::placeholder': {
                                                    color: '#9CA3AF',
                                                    opacity: 1,
                                                },
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E5E7EB',
                                            },
                                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderColor: '#D1D5DB',
                                                },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderColor: '#3B82F6',
                                                },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            color: '#374151',
                                            mb: 1,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        Địa chỉ
                                    </Typography>
                                    <TextField
                                        {...register('address')}
                                        fullWidth
                                        size="small"
                                        multiline
                                        rows={3}
                                        placeholder="Nhập địa chỉ của bạn"
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
                                        autoComplete="address-line1"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                color: '#374151 !important',
                                                padding: '10px',
                                                '&::placeholder': {
                                                    color: '#9CA3AF',
                                                    opacity: 1,
                                                },
                                            },
                                            '& .MuiInputBase-inputMultiline': {
                                                color: '#374151 !important',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E5E7EB',
                                            },
                                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderColor: '#D1D5DB',
                                                },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderColor: '#3B82F6',
                                                },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ p: 3, gap: 2, borderTop: '1px solid #E5E7EB' }}>
                            <Button
                                onClick={handleCancel}
                                variant="outlined"
                                disabled={isUpdating}
                                sx={{
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    fontSize: '0.9rem',
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isUpdating}
                                sx={{
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    fontSize: '0.9rem',
                                }}
                            >
                                {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </Box>
    );
};

export default ProfileForm;
