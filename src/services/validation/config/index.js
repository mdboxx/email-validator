import { ValidationConfig } from './validationConfig.js';

export const createConfig = (options = {}) => new ValidationConfig(options);

export const defaultConfig = new ValidationConfig();

export { ValidationConfig };