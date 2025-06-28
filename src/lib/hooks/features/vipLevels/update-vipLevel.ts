import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { FormInputGenericProps } from '@/components/interactive';
import axiosClient from '@/lib/configs/axios';

interface VipLevel {
    id: number;
    level_name: string;
    discount_rate: number;
    min_spend: number;
}
interface UpdateVipLevelParams {
    id: number;
    updatedVipLevel: Partial<VipLevel>;
}

export const updateVipLevelById = async ({ id, updatedVipLevel }: UpdateVipLevelParams) => {
    const response = await axiosClient.put(`/vip_level/${id}`, updatedVipLevel);
    return response.data;
};

export const useUpdateVipLevel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateVipLevelById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vip_level'] });
            toast.success(`Sửa cấp độ VIP thành công`);
        },
        onError: () => {
            toast.error('Sửa cấp độ VIP thất bại');
        },
    });
};

export const formStructureVL: FormInputGenericProps[] = [
    {
        label: 'ID',
        name: 'id',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Tên cấp độ',
        name: 'level_name',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
        disabled: true,
    },
    {
        label: 'Mức giảm giá (%)',
        name: 'discount_rate',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
    {
        label: 'Chi tiêu tối thiểu',
        name: 'min_spend',
        inputType: 'TextField',
        colSpan: tw`col-span-12`,
    },
];
