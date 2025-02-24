/* eslint-disable react/no-multi-comp */
import React from 'react';

import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';
import tw, { TwStyle } from 'twin.macro';

import { InputForm } from './InputForm';
import { Col, FormWrapper } from './styled';
import { FormInputGenericProps, FormInputTextField } from './type';

interface FieldGroupProps {
    formHandler: UseFormReturn<FieldValues, any> | UseFormReturn<any, any>;
    formStructure: FormInputGenericProps[];
    defaultValues?: FieldValues;
    gridCols?: TwStyle;
    spacing?: TwStyle;
    invisible?: boolean;
    disableInputFields?: boolean;
    componentStyle?: TwStyle;
}

export type FieldRenderProps = FormInputGenericProps & {
    defaultValues?: FieldValues;
};

const FieldRender: React.FC<FieldRenderProps> = (props) => {
    const { inputType, defaultValues, ...otherProps } = props;

    switch (inputType) {
        case 'TextField':
            return (
                <InputForm
                    defaultValue={defaultValues?.[props.name]}
                    {...(otherProps as FormInputTextField)}
                />
            );
        case 'SelectField':
            return <></>;
        default:
            return <div>Invalid inputType</div>;
    }
};

export const FieldGroup: React.FC<FieldGroupProps> = ({
    formHandler,
    formStructure,
    defaultValues,
    invisible,
    disableInputFields,
    gridCols = tw`grid-cols-12`,
    spacing = tw`gap-4`,
}) => (
    <FormWrapper invisible={invisible} spacing={spacing} css={gridCols}>
        <FormProvider {...formHandler}>
            {formStructure.map((field, index) => (
                <Col key={index} colSpan={field.colSpan}>
                    <FieldRender
                        {...field}
                        defaultValues={defaultValues}
                        disabled={disableInputFields ?? field.disabled}
                    />
                </Col>
            ))}
        </FormProvider>
    </FormWrapper>
);
