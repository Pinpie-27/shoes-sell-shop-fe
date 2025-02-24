/* eslint-disable no-unused-vars */

import React from 'react';

declare module 'react' {
    // The css prop
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        css?: CSSProp;
        tw?: string;
    }
    // The inline svg css prop
    interface SVGProps<T> extends SVGProps<SVGSVGElement> {
        css?: CSSProp;
        tw?: string;
    }
}
