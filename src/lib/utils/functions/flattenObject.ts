export const flattenObject = (
    obj: Record<string, any>,
    parentKey = '',
    result: Record<string, any> = {}
) => {
    window._.forEach(obj, (value, key) => {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (window._.isPlainObject(value)) {
            flattenObject(value, newKey, result);
        } else {
            // eslint-disable-next-line no-param-reassign
            result[newKey] = value;
        }
    });
    return result;
};
