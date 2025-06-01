import { atom } from 'jotai';

export interface FilterState {
    styleId?: number | null;
    categoryId?: number | null;
    colorId?: number | null;
}

export const filterAtom = atom<FilterState>({
    styleId: null,
    categoryId: null,
    colorId: null,
});
