/* eslint-disable no-unused-vars */
import 'twin.macro';
import styledImport, { css as cssImport, CSSProp } from 'styled-components';

declare module 'twin.macro' {
    const styled: typeof styledImport;
    const css: typeof cssImport;
}
