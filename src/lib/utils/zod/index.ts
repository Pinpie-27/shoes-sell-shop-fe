import { z as zod, ZodTypeAny } from 'zod';

import { Regex } from '../validations';

declare module 'zod' {
    // eslint-disable-next-line no-unused-vars
    interface ZodString {
        // noLeadingNumber(): ZodEffects<this, string, string>;
        // noTrailingNumber(): ZodEffects<this, string, string>;
        required(): ZodString;
        password(): ZodEffects<this, string, string>;
    }

    interface ZodEffects<T extends ZodTypeAny, Output = T['_output'], Input = T['_input']> {
        // noLeadingNumber(): ZodEffects<this, Output, Input>;
        // noTrailingNumber(): ZodEffects<this, Output, Input>;
        required(): ZodEffects<this, Output, Input>;
    }
}

zod.ZodString.prototype.required = function () {
    return this.trim().min(1, {
        message: 'Required',
    });
};

zod.ZodString.prototype.password = function () {
    return this.refine((val) => Regex.password.test(val), {
        message: 'Password is not in correct format',
    });
};

// zod.ZodString.prototype.email = function () {
//     return this.refine((val) => Regex.email.test(val), {
//         message: 'Email is not in correct format',
//     });
// };

export const z = zod;
