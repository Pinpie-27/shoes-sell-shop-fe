/* eslint-disable no-unused-vars */
declare module '*.svg' {
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const content: string;

    export { ReactComponent };
    export default content;
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes<T> extends DOMAttributes<T> {
            as?: string | Element;
        }
    }
    interface Window {
        _: typeof _;
    }
}
