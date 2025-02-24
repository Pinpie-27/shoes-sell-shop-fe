export const API_URL = import.meta.env.VITE_API_URL;
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT;
export const API_PREFIX = import.meta.env.VITE_API_PREFIX;
export const API_VERSION = import.meta.env.VITE_API_VERSION;
export const BASE_API_URL = API_URL + API_PREFIX + API_VERSION;

export const ACCESS_TOKEN = 'access_token';

export const FORMAT_DATE = 'DD/MM/YYYY';

export const TIME_ZONE = 'Asia/Ho_Chi_Minh';

export const PROJECT_CONFIG_KEY = import.meta.env.VITE_PROJECT_CONFIG_KEY || 'config';

export const ENCRYPTION_SECRET_KEY = 'react_js';
