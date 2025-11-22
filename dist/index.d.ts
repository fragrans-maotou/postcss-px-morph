import type { Plugin } from 'postcss';
import { PxMorphOptions } from './types';
import { defaultOptions } from './utils/validate';
export * from './types';
export { defaultOptions };
declare const Plugin: (options?: PxMorphOptions) => Plugin;
export default Plugin;
