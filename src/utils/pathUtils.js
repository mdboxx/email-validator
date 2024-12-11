import { sep, normalize, join } from 'path';

/**
 * Converts a path to the correct format for the current platform
 * @param {string} path - The path to convert
 * @returns {string} The platform-specific path
 */
export function getPlatformPath(path) {
  return normalize(path).split('/').join(sep);
}

/**
 * Creates a platform-independent path by joining path segments
 * @param {...string} paths - Path segments to join
 * @returns {string} The joined path
 */
export function createPath(...paths) {
  return getPlatformPath(join(...paths));
}