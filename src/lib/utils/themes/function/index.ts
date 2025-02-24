export const getCSSVariableValue = (variable: string) => {
    const regex = /var\((--[^)]+)\)/g;
    return variable.replace(regex, (_, cssVariableName) =>
        getComputedStyle(document.documentElement).getPropertyValue(cssVariableName.trim()).trim()
    );
};
export const pxToNumber = (px: string): number => parseInt(px.replace('px', ''));
export function pxToRem(number: number, baseNumber = 16) {
    return `${number / baseNumber}rem`;
}
