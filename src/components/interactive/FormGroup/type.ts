import React from 'react';

import { TwStyle } from 'twin.macro';

import { InputProps } from '../Input';

type GenericFormInput = {
    name: string;
    label?: React.ReactNode | string;
    placeholder?: string;
    validate?: object;
    defaultValue?: any;
    disabled?: boolean;
    colSpan: TwStyle; // Css of column span of the input container
    loading?: boolean;
};

//TextField
export type FormInputTextField = GenericFormInput & InputProps;

export type InputSizeType = 'small' | 'medium' | 'large';
export type InputRoundedType = 'medium' | 'large';

export type FormSelectField = GenericFormInput;

export type FormAutoComplete = GenericFormInput;

export type FormInputGenericProps =
    | (FormInputTextField & { inputType: 'TextField' })
    | (FormSelectField & { inputType: 'SelectField' })
    | (FormAutoComplete & { inputType: 'AutoComplete' });
